from fastapi import APIRouter
from db.mongodb import students_collection, predictions_collection, serialize_docs

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats():
    """Get dashboard statistics from MongoDB"""
    try:
        # Get total students
        total_students = students_collection.count_documents({})
        
        # Get all predictions for calculations
        predictions = list(predictions_collection.find())
        
        if predictions:
            # Calculate average score
            scores = [p.get("perf_score", 0) for p in predictions if p.get("perf_score")]
            avg_score = sum(scores) / len(scores) if scores else 0
            
            # Calculate average attendance
            attendances = [p.get("attend_rate", 0) for p in predictions if p.get("attend_rate")]
            avg_attendance = sum(attendances) / len(attendances) if attendances else 0
            
            # Count high risk students
            high_risk = sum(1 for p in predictions if p.get("risk_level") == "high")
        else:
            avg_score = 0
            avg_attendance = 0
            high_risk = 0
        
        stats = {
            "total_students": total_students,
            "avg_score": round(avg_score, 1),
            "attendance": round(avg_attendance, 1),
            "high_risk": high_risk
        }
        
        print(f"📊 Dashboard stats: {stats}")
        return stats
    except Exception as e:
        print(f"❌ Dashboard stats error: {e}")
        return {
            "total_students": 0,
            "avg_score": 0,
            "attendance": 0,
            "high_risk": 0
        }
