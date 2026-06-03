from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="EduPredict API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "EduPredict API is running", "docs": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Include routers (lazy loading to prevent startup issues)
@app.on_event("startup")
async def startup_event():
    """Include routers and initialize database on startup"""
    try:
        from routers import students, predictions, suggestions, dashboard, auth, reports
        from routers import students_mongo, predictions_mongo, dashboard_mongo, bulk_import, notifications
        from db.session import init_db, SessionLocal
        from db.mongodb import test_connection, sync_sql_to_mongo
        from db.models import Student
        from db.seed import seed_database
        
        # Include routers
        app.include_router(students.router, prefix="/students", tags=["students"])
        app.include_router(predictions.router, prefix="/predict", tags=["predictions"])
        app.include_router(suggestions.router, prefix="/suggestions", tags=["suggestions"])
        app.include_router(dashboard.router, prefix="/analytics", tags=["analytics"])
        app.include_router(auth.router, prefix="/auth", tags=["auth"])
        app.include_router(reports.router, prefix="/reports", tags=["reports"])
        
        # MongoDB routers
        app.include_router(students_mongo.router, prefix="/mongo/students", tags=["mongo-students"])
        app.include_router(predictions_mongo.router, prefix="/mongo/predict", tags=["mongo-predictions"])
        app.include_router(dashboard_mongo.router, prefix="/mongo/analytics", tags=["mongo-analytics"])
        app.include_router(bulk_import.router, prefix="/import", tags=["import"])
        app.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
        
        # Initialize database
        init_db()

        # Seed SQL database from dataset if empty
        db = SessionLocal()
        try:
            if db.query(Student).count() == 0:
                seed_database(db)
            sync_sql_to_mongo(db)
        finally:
            db.close()
        
        # Test MongoDB connection (optional)
        test_connection()
    except Exception as e:
        print(f"Startup error: {e}")
        # Continue startup even if some components fail
