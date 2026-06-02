from fastapi import APIRouter, HTTPException, Depends
from db.mongodb import predictions_collection, students_collection, serialize_doc
from services.predictor import predict_student, build_features
from db.session import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/{student_id}")
def get_prediction(student_id: int, db: Session = Depends(get_db)):
    """Get prediction for a specific student"""
    try:
        # Check if prediction exists in MongoDB
        existing_prediction = predictions_collection.find_one({"student_id": student_id})
        if existing_prediction:
            return serialize_doc(existing_prediction)
        
        # If not, generate new prediction
        features = build_features(student_id, db)
        prediction = predict_student(features, student_id, db)
        
        # Store in MongoDB
        prediction["created_at"] = datetime.now()
        predictions_collection.insert_one(prediction)
        
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
def get_all_predictions():
    """Get all predictions"""
    try:
        predictions = list(predictions_collection.find())
        return [serialize_doc(p) for p in predictions]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
