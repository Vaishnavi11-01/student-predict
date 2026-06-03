from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.session import get_db
from db.models import Student, Grade, Attendance, Prediction
from typing import List

router = APIRouter()


class StudentCreateRequest(BaseModel):
    name: str
    class_name: str
    section: str = ""
    parent_phone: str = ""
    parent_email: str = ""
    income_tier: int = 3
    avg_score: float = 0.0
    attendance_rate: float = 0.0
    weak_subjects: str = ""


def derive_perf_category(score: float) -> str:
    if score >= 85:
        return "Excellent"
    if score >= 70:
        return "Good"
    if score >= 50:
        return "Average"
    return "Poor"

@router.get("/")
def get_students(db: Session = Depends(get_db)):
    """Get all students with summary data"""
    students = db.query(Student).all()
    result = []

    for s in students:
        latest_prediction = db.query(Prediction).filter(Prediction.student_id == s.id).order_by(Prediction.generated_at.desc()).first()
        grades = db.query(Grade).filter(Grade.student_id == s.id).all()
        attendance = db.query(Attendance).filter(Attendance.student_id == s.id).all()

        result.append({
            "id": s.id,
            "name": s.name,
            "class_name": s.class_name,
            "section": s.section,
            "parent_phone": s.parent_phone,
            "parent_email": s.parent_email,
            "income_tier": s.income_tier,
            "avg_score": s.avg_score,
            "attendance_rate": s.attendance_rate,
            "weak_subjects": s.weak_subjects,
            "grades": [
                {
                    "subject": g.subject,
                    "score": g.score,
                    "exam_type": g.exam_type,
                    "date": g.date.isoformat()
                }
                for g in grades
            ],
            "attendance": [
                {
                    "date": a.date.isoformat(),
                    "status": a.status
                }
                for a in attendance
            ],
            "latest_prediction": {
                "perf_score": latest_prediction.perf_score,
                "attend_rate": latest_prediction.attend_rate,
                "dropout_risk": latest_prediction.dropout_risk,
                "risk_level": latest_prediction.risk_level,
                "perf_category": derive_perf_category(latest_prediction.perf_score),
                "generated_at": latest_prediction.generated_at.isoformat()
            } if latest_prediction else None
        })

    return result

@router.post("/")
def create_student(payload: StudentCreateRequest, db: Session = Depends(get_db)):
    """Create a new student record"""
    student = Student(
        name=payload.name,
        class_name=payload.class_name,
        section=payload.section,
        parent_phone=payload.parent_phone,
        parent_email=payload.parent_email,
        income_tier=payload.income_tier,
        avg_score=payload.avg_score,
        attendance_rate=payload.attendance_rate,
        weak_subjects=payload.weak_subjects
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return {
        "id": student.id,
        "name": student.name,
        "class_name": student.class_name,
        "section": student.section,
        "parent_phone": student.parent_phone,
        "parent_email": student.parent_email,
        "income_tier": student.income_tier,
        "avg_score": student.avg_score,
        "attendance_rate": student.attendance_rate,
        "weak_subjects": student.weak_subjects
    }

@router.get("/{student_id}")
def get_student(student_id: int, db: Session = Depends(get_db)):
    """Get a specific student with their data"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        return {"error": "Student not found"}
    
    grades = db.query(Grade).filter(Grade.student_id == student_id).all()
    attendance = db.query(Attendance).filter(Attendance.student_id == student_id).all()
    predictions = db.query(Prediction).filter(Prediction.student_id == student_id).order_by(Prediction.generated_at.desc()).first()
    
    return {
        "id": student.id,
        "name": student.name,
        "class_name": student.class_name,
        "section": student.section,
        "parent_phone": student.parent_phone,
        "parent_email": student.parent_email,
        "income_tier": student.income_tier,
        "avg_score": student.avg_score,
        "attendance_rate": student.attendance_rate,
        "weak_subjects": student.weak_subjects,
        "grades": [
            {
                "subject": g.subject,
                "score": g.score,
                "exam_type": g.exam_type,
                "date": g.date.isoformat()
            }
            for g in grades
        ],
        "attendance": [
            {
                "date": a.date.isoformat(),
                "status": a.status
            }
            for a in attendance
        ],
        "latest_prediction": {
            "perf_score": predictions.perf_score,
            "attend_rate": predictions.attend_rate,
            "dropout_risk": predictions.dropout_risk,
            "risk_level": predictions.risk_level,
            "perf_category": derive_perf_category(predictions.perf_score),
            "generated_at": predictions.generated_at.isoformat()
        } if predictions else None
    }
