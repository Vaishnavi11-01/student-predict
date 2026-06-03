import os
from pymongo import MongoClient
from bson import ObjectId
from sqlalchemy.orm import Session
from db.models import Student, Prediction

# MongoDB connection string
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")

# Create MongoDB client
client = MongoClient(MONGODB_URI)

# Database name
db_name = os.getenv("DB_NAME", "ai_academic_platform")
db = client[db_name]

# Collections
students_collection = db["students"]
predictions_collection = db["predictions"]
attendance_collection = db["attendance"]
grades_collection = db["grades"]
suggestions_collection = db["suggestions"]
users_collection = db["users"]


def serialize_doc(doc):
    """Convert MongoDB ObjectId to string for JSON serialization"""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


def serialize_docs(docs):
    """Convert multiple documents with ObjectId to strings"""
    return [serialize_doc(doc.copy()) for doc in docs]


def test_connection():
    """Test MongoDB connection"""
    try:
        client.admin.command('ping')
        print("✅ MongoDB connection successful")
        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False


def sync_sql_to_mongo(db_session: Session):
    """Sync SQL student and prediction data into MongoDB when MongoDB is empty."""
    try:
        sql_students = db_session.query(Student).all()
        if not sql_students:
            print("⚠️  No SQL students to sync to MongoDB")
            return

        existing_count = students_collection.count_documents({})
        if existing_count > 0:
            print(f"✅ MongoDB already has {existing_count} students, skipping sync")
            return

        student_docs = []
        for student in sql_students:
            student_docs.append({
                "id": student.id,
                "name": student.name,
                "class_name": student.class_name,
                "section": student.section,
                "parent_phone": student.parent_phone,
                "parent_email": student.parent_email,
                "income_tier": student.income_tier,
                "avg_score": getattr(student, "avg_score", 0.0) or 0.0,
                "attendance_rate": getattr(student, "attendance_rate", 0.0) or 0.0,
                "weak_subjects": getattr(student, "weak_subjects", "") or ""
            })

        if student_docs:
            result = students_collection.insert_many(student_docs)
            print(f"✅ Synced {len(result.inserted_ids)} students to MongoDB")

        prediction_docs = []
        for prediction in db_session.query(Prediction).all():
            prediction_docs.append({
                "student_id": prediction.student_id,
                "perf_score": prediction.perf_score,
                "attend_rate": prediction.attend_rate,
                "dropout_risk": prediction.dropout_risk,
                "risk_level": prediction.risk_level,
                "generated_at": prediction.generated_at
            })

        if prediction_docs:
            result = predictions_collection.insert_many(prediction_docs)
            print(f"✅ Synced {len(result.inserted_ids)} predictions to MongoDB")
        
        print(f"✅ Total students in MongoDB: {students_collection.count_documents({})}")
    except Exception as e:
        print(f"❌ MongoDB sync failed: {e}")


if __name__ == "__main__":
    test_connection()
