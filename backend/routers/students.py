from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from db.models import Student, Grade, Attendance, Prediction
from typing import List

router = APIRouter()

@router.get("/")
def get_students(db: Session = Depends(get_db)):
    """Get all students"""
    students = db.query(Student).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "class_name": s.class_name,
            "section": s.section
        }
        for s in students
    ]

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
            "generated_at": predictions.generated_at.isoformat()
        } if predictions else None
    }
