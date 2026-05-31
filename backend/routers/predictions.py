from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from services.predictor import build_features, predict_student

router = APIRouter()

@router.get("/{student_id}")
def get_prediction(student_id: int, db: Session = Depends(get_db)):
    """Get predictions for a student"""
    features = build_features(student_id, db)
    prediction = predict_student(features, student_id, db)
    return prediction
