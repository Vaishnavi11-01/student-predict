from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import students, predictions, suggestions, dashboard, auth
from db.session import init_db

app = FastAPI(title="EduPredict API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(students.router, prefix="/students", tags=["students"])
app.include_router(predictions.router, prefix="/predict", tags=["predictions"])
app.include_router(suggestions.router, prefix="/suggestions", tags=["suggestions"])
app.include_router(dashboard.router, prefix="/analytics", tags=["analytics"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()

@app.get("/")
def root():
    return {"message": "EduPredict API is running", "docs": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
