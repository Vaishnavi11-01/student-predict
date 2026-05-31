from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from db.models import Student, Grade, Prediction

router = APIRouter()

@router.get("/{student_id}")
def get_suggestions(student_id: int, db: Session = Depends(get_db)):
    """Get AI study suggestions for a student (simplified version)"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        return {"error": "Student not found"}
    
    prediction = db.query(Prediction).filter(Prediction.student_id == student_id).order_by(Prediction.generated_at.desc()).first()
    
    # Get weak subjects
    grades = db.query(Grade).filter(Grade.student_id == student_id).all()
    subject_scores = {}
    for g in grades:
        if g.subject not in subject_scores:
            subject_scores[g.subject] = []
        subject_scores[g.subject].append(g.score)
    
    weak_subjects = [subj for subj, scores in subject_scores.items() if sum(scores) / len(scores) < 60]
    
    # Generate suggestions (in production, use Claude API)
    suggestions = f"""Study Suggestions for {student.name}:

1. Focus on improving {', '.join(weak_subjects) if weak_subjects else 'all subjects'} with daily practice.
2. Set up a consistent study schedule with 30-minute focused sessions.
3. Use active recall techniques - test yourself regularly instead of just re-reading.

Teacher Action for This Week:
Schedule a one-on-one meeting to discuss progress and provide additional resources for {weak_subjects[0] if weak_subjects else 'core subjects'}."""
    
    return {"suggestions": suggestions}
