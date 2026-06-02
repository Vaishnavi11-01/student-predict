from pymongo import MongoClient
from bson import ObjectId
import os

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

if __name__ == "__main__":
    test_connection()
