import numpy as np
from sqlalchemy.orm import Session
from db.models import Student, Grade, Attendance, Prediction
from datetime import datetime, timedelta
import pandas as pd

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
    
    # Last 30 days
    thirty_days_ago = datetime.now() - timedelta(days=30)
    recent = df_g[df_g["date"] >= thirty_days_ago] if not df_g.empty else df_g
    
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

def predict_student(features: dict, student_id: int, db: Session) -> dict:
    """Make predictions for a student (simplified version without actual ML models)"""
    # In production, load actual ML models here
    # For now, use rule-based predictions
    
    avg_score = features["avg_score_30d"]
    attendance_rate = features["attendance_rate_30d"]
    weak_subjects = features["weak_subject_count"]
    
    # Simulated predictions
    perf_score = min(100, max(0, avg_score + np.random.normal(0, 5)))
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
        perf_score=perf_score,
        attend_rate=attendance_rate * 100,
        dropout_risk=dropout_prob,
        risk_level=risk_level,
        generated_at=datetime.now()
    )
    db.add(prediction)
    db.commit()
    
    return {
        "student_id": student_id,
        "perf_score": round(perf_score, 1),
        "attend_rate": round(attendance_rate * 100, 1),
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
