from fastapi import APIRouter, HTTPException
from db.mongodb import students_collection, predictions_collection
from services.email_service import email_service

router = APIRouter()

@router.post("/send-high-risk-alerts")
def send_high_risk_alerts():
    """Send email notifications to parents of high-risk students"""
    try:
        # Get all high-risk predictions
        high_risk_predictions = list(predictions_collection.find({"risk_level": "high"}))
        
        if not high_risk_predictions:
            return {
                "success": True,
                "message": "No high-risk students found",
                "sent": 0
            }
        
        emails_sent = 0
        emails_failed = 0
        
        for prediction in high_risk_predictions:
            student_id = prediction.get("student_id")
            student = students_collection.find_one({"id": student_id})
            
            if not student:
                continue
            
            parent_email = student.get("parent_email")
            if not parent_email:
                print(f"⚠️  No parent email for student {student.get('name')}")
                continue
            
            # Send notification
            success = email_service.send_high_risk_notification(
                parent_email=parent_email,
                student_name=student.get("name", "Unknown"),
                risk_level=prediction.get("risk_level", "unknown"),
                dropout_risk=prediction.get("dropout_risk", 0) * 100,
                suggestions=[]
            )
            
            if success:
                emails_sent += 1
            else:
                emails_failed += 1
        
        return {
            "success": True,
            "sent": emails_sent,
            "failed": emails_failed,
            "total_high_risk_students": len(high_risk_predictions)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send alerts: {str(e)}")

@router.post("/send-alert/{student_id}")
def send_alert_for_student(student_id: int):
    """Send alert for a specific student"""
    try:
        # Get student and prediction
        student = students_collection.find_one({"id": student_id})
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        prediction = predictions_collection.find_one({"student_id": student_id})
        if not prediction:
            raise HTTPException(status_code=404, detail="No prediction found for student")
        
        parent_email = student.get("parent_email")
        if not parent_email:
            raise HTTPException(status_code=400, detail="Parent email not configured for this student")
        
        # Send notification
        success = email_service.send_high_risk_notification(
            parent_email=parent_email,
            student_name=student.get("name", "Unknown"),
            risk_level=prediction.get("risk_level", "unknown"),
            dropout_risk=prediction.get("dropout_risk", 0) * 100,
            suggestions=[]
        )
        
        if success:
            return {
                "success": True,
                "message": f"Alert sent to {parent_email}"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to send email")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
