from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.session import get_db
from db.models import Student, Prediction

router = APIRouter()

@router.get("/stats")
def dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    total_students = db.query(Student).count()
    
    # Calculate average score from predictions
    avg_score = db.query(func.avg(Prediction.perf_score)).scalar() or 0
    
    # Calculate average attendance rate
    avg_attendance = db.query(func.avg(Prediction.attend_rate)).scalar() or 0
    
    # Count high risk students
    high_risk = db.query(Prediction).filter(Prediction.risk_level == "high").count()
    
    return {
        "total_students": total_students,
        "avg_score": round(avg_score, 1),
        "attendance": round(avg_attendance, 1),
        "high_risk": high_risk
    }
