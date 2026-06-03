from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from services.predictor import build_features, predict_student

router = APIRouter()

@router.get("/")
def get_all_predictions():
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
