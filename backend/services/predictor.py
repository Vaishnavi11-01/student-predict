import numpy as np
import joblib
from sqlalchemy.orm import Session
from db.models import Student, Grade, Attendance, Prediction
from datetime import datetime, timedelta
import pandas as pd
import os

def build_features(student_id: int, db: Session) -> dict:
    """Build feature vector for a student"""
    grades = db.query(Grade).filter(Grade.student_id == student_id).all()
    attendance = db.query(Attendance).filter(Attendance.student_id == student_id).all()
    
    df_g = pd.DataFrame([{
        'score': g.score,
        'subject': g.subject,
        'exam_type': g.exam_type,
        'date': g.date
    } for g in grades])
    
    df_a = pd.DataFrame([{
        'status': a.status,
        'date': a.date
    } for a in attendance])
    
    # Last 30 days - use all grades for simplicity
    recent = df_g
    
    features = {
        # Academic features
        "avg_score_30d": recent["score"].mean() if not recent.empty else 70.0,
        "score_trend": np.polyfit(range(len(df_g)), df_g["score"], 1)[0] if len(df_g) > 1 else 0.0,
        "weak_subject_count": (df_g.groupby("subject")["score"].mean() < 60).sum() if not df_g.empty else 0,
        "hw_completion_rate": len(df_g[df_g["exam_type"]=="homework"]) / max(1, len(df_g)) if not df_g.empty else 0.5,
        
        # Attendance features
        "attendance_rate_30d": (df_a["status"]=="present").sum() / max(1, len(df_a)) if not df_a.empty else 0.9,
        "consecutive_absences": max_consecutive_absences(df_a),
        "late_count_30d": (df_a["status"]=="late").sum() if not df_a.empty else 0,
        
        # Demographic
        "income_tier": db.query(Student).filter(Student.id == student_id).first().income_tier if db.query(Student).filter(Student.id == student_id).first() else 3,
    }
    
    # Fill NaN values
    for key, value in features.items():
        if pd.isna(value):
            features[key] = 0.0
    
    return features

def max_consecutive_absences(df):
    """Calculate maximum consecutive absences"""
    if df.empty:
        return 0
    streak = max_streak = 0
    for s in df["status"]:
        streak = streak + 1 if s == "absent" else 0
        max_streak = max(max_streak, streak)
    return max_streak

def build_score_features(student_id: int, db: Session) -> dict:
    """Build feature vector for student_model (score prediction)"""
    grades = db.query(Grade).filter(Grade.student_id == student_id).all()
    attendance = db.query(Attendance).filter(Attendance.student_id == student_id).all()
    student = db.query(Student).filter(Student.id == student_id).first()
    
    df_g = pd.DataFrame([{
        'score': g.score,
        'subject': g.subject,
        'exam_type': g.exam_type,
        'date': g.date
    } for g in grades])
    
    df_a = pd.DataFrame([{
        'status': a.status,
        'date': a.date
    } for a in attendance])
    
    # Calculate features for student_model
    # StudyHours: Estimate based on grade count
    if not df_g.empty and "exam_type" in df_g.columns:
        study_hours = len(df_g[df_g["exam_type"] == "homework"]) * 2 + len(df_g[df_g["exam_type"] == "unit_test"]) * 3
    else:
        study_hours = len(df_g) * 2  # Default: 2 hours per grade
    
    # Attendance: Calculate attendance rate
    attendance_rate = (df_a["status"] == "present").sum() / max(1, len(df_a)) if not df_a.empty else 0.9
    
    # PreviousMarks: Average of previous grades
    previous_marks = df_g["score"].mean() if not df_g.empty else 70.0
    
    # AssignmentScore: Average of homework scores
    if not df_g.empty and "exam_type" in df_g.columns:
        assignment_scores = df_g[df_g["exam_type"] == "homework"]["score"]
        assignment_score = assignment_scores.mean() if not assignment_scores.empty else previous_marks
    else:
        assignment_score = previous_marks
    
    return {
        "StudyHours": study_hours,
        "Attendance": attendance_rate * 100,
        "PreviousMarks": previous_marks,
        "AssignmentScore": assignment_score
    }

def predict_student(features: dict, student_id: int, db: Session) -> dict:
    """Make predictions for a student using trained ML models"""
    
    # ========== SCORE PREDICTION (student_model.pkl) ==========
    score_features = build_score_features(student_id, db)
    score_model_path = os.path.join(os.path.dirname(__file__), '../models/student_model.pkl')
    
    if os.path.exists(score_model_path):
        score_model = joblib.load(score_model_path)
        score_vector = np.array([
            score_features["StudyHours"],
            score_features["Attendance"],
            score_features["PreviousMarks"],
            score_features["AssignmentScore"]
        ]).reshape(1, -1)
        predicted_score = float(score_model.predict(score_vector)[0])
        predicted_score = min(100, max(0, predicted_score))
    else:
        # Fallback to average score
        predicted_score = features["avg_score_30d"]
    
    # Performance category
    if predicted_score >= 85:
        perf_category = "Excellent"
    elif predicted_score >= 70:
        perf_category = "Good"
    elif predicted_score >= 50:
        perf_category = "Average"
    else:
        perf_category = "Poor"
    
    # ========== DROPOUT RISK PREDICTION (dropout_model.pkl) ==========
    dropout_model_path = os.path.join(os.path.dirname(__file__), '../models/dropout_model.pkl')
    if os.path.exists(dropout_model_path):
        dropout_model = joblib.load(dropout_model_path)
        
        # Prepare features for dropout model
        dropout_vector = np.array([
            features["avg_score_30d"],
            features["attendance_rate_30d"],
            features["weak_subject_count"],
            features["consecutive_absences"],
            features["score_trend"],
            features["income_tier"]
        ]).reshape(1, -1)
        
        # Predict dropout probability
        dropout_prob = float(dropout_model.predict_proba(dropout_vector)[0][1])
    else:
        # Fallback to rule-based if model not found
        avg_score = features["avg_score_30d"]
        attendance_rate = features["attendance_rate_30d"]
        dropout_prob = 1.0 - (attendance_rate * 0.4 + avg_score / 100 * 0.4 + (5 - features["income_tier"]) / 5 * 0.2)
        dropout_prob = max(0, min(1, dropout_prob))
    
    risk_level = (
        "high" if dropout_prob > 0.65 else
        "medium" if dropout_prob > 0.35 else
        "low"
    )
    
    # Save prediction to database
    prediction = Prediction(
        student_id=student_id,
        perf_score=predicted_score,
        attend_rate=features["attendance_rate_30d"] * 100,
        dropout_risk=dropout_prob,
        risk_level=risk_level,
        generated_at=datetime.now()
    )
    db.add(prediction)
    db.commit()
    
    return {
        "student_id": student_id,
        "predicted_score": round(predicted_score, 1),
        "performance_category": perf_category,
        "dropout_risk": round(dropout_prob * 100, 1),
        "risk_level": risk_level,
    }

def get_attendance_sequence(student_id: int, db: Session):
    """Get attendance sequence for LSTM model"""
    attendance = db.query(Attendance).filter(Attendance.student_id == student_id).order_by(Attendance.date).limit(12).all()
    sequence = np.array([[1 if a.status == "present" else 0] for a in attendance])
    if len(sequence) < 12:
        sequence = np.pad(sequence, ((12 - len(sequence), 0), (0, 0)), mode='constant')
    return sequence.reshape(1, 12, 1)
