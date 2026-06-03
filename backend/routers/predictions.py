from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.session import get_db
from db.models import Prediction
from services.predictor import build_features, predict_student, predict_from_manual_input

router = APIRouter()

class ManualPredictionRequest(BaseModel):
    name: str
    grade: str
    avg_score: float
    attendance_rate: float
    weak_subjects: str = ""

@router.get("/")
def get_all_predictions(db: Session = Depends(get_db)):
    """Get all predictions"""
    try:
        predictions = db.query(Prediction).all()
        return [
            {
                "student_id": p.student_id,
                "perf_score": p.perf_score,
                "attend_rate": p.attend_rate,
                "dropout_risk": p.dropout_risk,
                "risk_level": p.risk_level,
                "generated_at": p.generated_at.isoformat()
            }
            for p in predictions
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{student_id}")
def get_prediction(student_id: int, db: Session = Depends(get_db)):
    """Get predictions for a student"""
    features = build_features(student_id, db)
    prediction = predict_student(features, student_id, db)
    return prediction

@router.post("/manual")
def manual_prediction(request: ManualPredictionRequest):
    """Get a prediction from a manual student form"""
    try:
        prediction = predict_from_manual_input(
            study_hours=request.avg_score / 10.0 * 2.0,
            attendance_rate=request.attendance_rate,
            previous_marks=request.avg_score,
            assignment_score=request.avg_score * 0.9
        )
        return {
            "student_name": request.name,
            "grade": request.grade,
            "weak_subjects": request.weak_subjects,
            **prediction
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
