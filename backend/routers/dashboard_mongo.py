from fastapi import APIRouter
from db.mongodb import students_collection, predictions_collection, serialize_docs

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        # Get total students
        total_students = students_collection.count_documents({})
        
        # Get all predictions for calculations
        predictions = list(predictions_collection.find())
        
        if predictions:
            # Calculate average score
            avg_score = sum(p.get("perf_score", 0) for p in predictions) / len(predictions)
            
            # Calculate average attendance
            avg_attendance = sum(p.get("attend_rate", 0) for p in predictions) / len(predictions)
            
            # Count high risk students
            high_risk = sum(1 for p in predictions if p.get("risk_level") == "high")
        else:
            avg_score = 0
            avg_attendance = 0
            high_risk = 0
        
        return {
            "total_students": total_students,
            "avg_score": round(avg_score, 1),
            "attendance": round(avg_attendance, 1),
            "high_risk": high_risk
        }
    except Exception as e:
        return {
            "total_students": 0,
            "avg_score": 0,
            "attendance": 0,
            "high_risk": 0
        }
