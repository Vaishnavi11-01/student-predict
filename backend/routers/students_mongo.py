from fastapi import APIRouter, HTTPException
from db.mongodb import students_collection, serialize_doc, serialize_docs
from datetime import datetime

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
    """Create a new student"""
    try:
        student_data["created_at"] = datetime.now()
        result = students_collection.insert_one(student_data)
        return {"id": str(result.inserted_id), "message": "Student created successfully"}
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
