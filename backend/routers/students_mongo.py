from fastapi import APIRouter, HTTPException
from db.mongodb import students_collection, predictions_collection, serialize_doc, serialize_docs
from datetime import datetime
from services.predictor import predict_from_manual_input

router = APIRouter()

@router.get("/")
def get_all_students():
    """Get all students"""
    try:
        students = list(students_collection.find())
        return serialize_docs(students)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{student_id}")
def get_student(student_id: int):
    """Get a specific student by ID"""
    try:
        student = students_collection.find_one({"id": student_id})
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return serialize_doc(student)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
def create_student(student_data: dict):
    """Create a new student and auto-generate prediction"""
    try:
        last_student = students_collection.find_one(sort=[("id", -1)])
        next_id = (last_student["id"] + 1) if last_student and "id" in last_student else 1
        student_data["id"] = next_id
        student_data["created_at"] = datetime.now()
        
        # Insert student into MongoDB
        result = students_collection.insert_one(student_data)
        
        # Auto-generate prediction based on student data
        try:
            avg_score = student_data.get("avg_score", 70)
            attendance_rate = student_data.get("attendance_rate", 85)
            
            # Map avg_score to study_hours (avg_score/100 * 2 * 10 scale)
            study_hours = (avg_score / 100) * 20
            
            # Call predictor with manual input
            prediction = predict_from_manual_input(
                study_hours=study_hours,
                attendance_rate=attendance_rate,
                previous_marks=avg_score,
                assignment_score=avg_score
            )
            
            # Store prediction in MongoDB
            prediction_doc = {
                "student_id": next_id,
                "perf_score": prediction["perf_score"],
                "attend_rate": prediction["attend_rate"],
                "dropout_risk": prediction["dropout_risk"],
                "risk_level": prediction["risk_level"],
                "perf_category": prediction.get("perf_category", "Unknown"),
                "generated_at": datetime.now()
            }
            predictions_collection.insert_one(prediction_doc)
            print(f"✅ Generated prediction for student {next_id}: {prediction['risk_level']} risk")
        except Exception as pred_error:
            print(f"⚠️  Failed to auto-generate prediction: {pred_error}")
        
        return {"id": next_id, "message": "Student created successfully with auto-generated prediction"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{student_id}")
def update_student(student_id: int, student_data: dict):
    """Update a student"""
    try:
        result = students_collection.update_one(
            {"id": student_id},
            {"$set": student_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Student not found")
        return {"message": "Student updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{student_id}")
def delete_student(student_id: int):
    """Delete a student"""
    try:
        result = students_collection.delete_one({"id": student_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Student not found")
        return {"message": "Student deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
