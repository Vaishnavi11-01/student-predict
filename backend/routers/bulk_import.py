import csv
from fastapi import APIRouter, HTTPException, UploadFile, File
from db.mongodb import students_collection, predictions_collection
from datetime import datetime
from services.predictor import predict_from_manual_input
import io

router = APIRouter()

@router.post("/bulk-import")
async def bulk_import_students(file: UploadFile = File(...)):
    """Bulk import students from CSV file"""
    try:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        
        # Read CSV file
        contents = await file.read()
        csv_data = contents.decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(csv_data))
        
        if not csv_reader.fieldnames:
            raise HTTPException(status_code=400, detail="CSV file is empty")
        
        # Expected columns: name, class_name, section, avg_score, attendance_rate, weak_subjects
        required_fields = ['name', 'class_name', 'avg_score', 'attendance_rate']
        missing_fields = [field for field in required_fields if field not in csv_reader.fieldnames]
        
        if missing_fields:
            raise HTTPException(status_code=400, detail=f"Missing required columns: {', '.join(missing_fields)}")
        
        imported_count = 0
        failed_records = []
        
        # Get last student ID
        last_student = students_collection.find_one(sort=[("id", -1)])
        next_id = (last_student["id"] + 1) if last_student and "id" in last_student else 1
        
        for row_idx, row in enumerate(csv_reader, start=2):
            try:
                # Validate required fields
                if not row.get('name', '').strip():
                    failed_records.append(f"Row {row_idx}: Missing name")
                    continue
                
                if not row.get('class_name', '').strip():
                    failed_records.append(f"Row {row_idx}: Missing class_name")
                    continue
                
                # Parse scores
                try:
                    avg_score = float(row.get('avg_score', 0))
                    attendance_rate = float(row.get('attendance_rate', 0))
                except ValueError:
                    failed_records.append(f"Row {row_idx}: Invalid score format (must be numeric)")
                    continue
                
                # Validate ranges
                if not (0 <= avg_score <= 100) or not (0 <= attendance_rate <= 100):
                    failed_records.append(f"Row {row_idx}: Scores must be between 0-100")
                    continue
                
                # Create student document
                student_doc = {
                    "id": next_id,
                    "name": row.get('name', '').strip(),
                    "class_name": row.get('class_name', '').strip(),
                    "section": row.get('section', '').strip(),
                    "parent_phone": row.get('parent_phone', '').strip(),
                    "parent_email": row.get('parent_email', '').strip(),
                    "income_tier": int(row.get('income_tier', 3)),
                    "avg_score": avg_score,
                    "attendance_rate": attendance_rate,
                    "weak_subjects": row.get('weak_subjects', '').strip(),
                    "created_at": datetime.now()
                }
                
                # Insert student
                students_collection.insert_one(student_doc)
                
                # Auto-generate prediction
                try:
                    study_hours = (avg_score / 100) * 20
                    prediction = predict_from_manual_input(
                        study_hours=study_hours,
                        attendance_rate=attendance_rate,
                        previous_marks=avg_score,
                        assignment_score=avg_score
                    )
                    
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
                except Exception as pred_error:
                    print(f"Warning: Could not generate prediction for student {next_id}: {pred_error}")
                
                imported_count += 1
                next_id += 1
                
            except Exception as row_error:
                failed_records.append(f"Row {row_idx}: {str(row_error)}")
        
        return {
            "success": True,
            "imported": imported_count,
            "failed": len(failed_records),
            "failed_records": failed_records[:10]  # Return first 10 failures
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")
