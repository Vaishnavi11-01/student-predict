from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from services.pdf_generator import (
    generate_student_report_card,
    generate_prediction_report,
    generate_analytics_report
)
from routers.students import get_student
from routers.predictions import get_all_predictions
from routers.dashboard import get_dashboard_stats

router = APIRouter()

@router.get("/student/{student_id}")
def get_student_report_card(student_id: int):
    """Generate PDF report card for a specific student"""
    try:
        # Get student data
        student_data = get_student(student_id)
        
        # Get prediction data
        prediction_data = get_student(student_id)
        
        # Generate PDF
        pdf_buffer = generate_student_report_card(student_data, prediction_data)
        
        # Return PDF
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=student_{student_id}_report.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/predictions")
def get_prediction_report():
    """Generate PDF report for all predictions"""
    try:
        # Get all predictions
        predictions = get_all_predictions()
        
        # Generate PDF
        pdf_buffer = generate_prediction_report(predictions)
        
        # Return PDF
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=predictions_report.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics")
def get_analytics_report():
    """Generate PDF analytics report"""
    try:
        # Get dashboard stats
        stats = get_dashboard_stats()
        
        # Generate PDF
        pdf_buffer = generate_analytics_report(stats)
        
        # Return PDF
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=analytics_report.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
