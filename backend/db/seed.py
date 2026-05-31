from sqlalchemy.orm import Session
from db.models import Student, Grade, Attendance, Prediction
from datetime import datetime, timedelta
import random

def seed_database(db: Session):
    """Seed the database with sample data for testing"""
    
    # Create sample students
    students = []
    for i in range(1, 11):
        student = Student(
            name=f"Student {i}",
            class_name=random.choice(["Grade 10", "Grade 11", "Grade 12"]),
            section=random.choice(["A", "B", "C"]),
            parent_phone=f"+123456789{i}",
            parent_email=f"parent{i}@example.com",
            income_tier=random.randint(1, 5)
        )
        db.add(student)
        students.append(student)
    
    db.commit()
    
    # Add grades for each student
    subjects = ["Math", "Science", "English", "History", "Physics"]
    exam_types = ["unit_test", "midterm", "final", "homework"]
    
    for student in students:
        for _ in range(20):  # 20 grades per student
            grade = Grade(
                student_id=student.id,
                subject=random.choice(subjects),
                score=random.uniform(40, 100),
                exam_type=random.choice(exam_types),
                date=datetime.now() - timedelta(days=random.randint(1, 365))
            )
            db.add(grade)
    
    # Add attendance for each student
    statuses = ["present", "absent", "late"]
    
    for student in students:
        for _ in range(90):  # 90 days of attendance
            attendance = Attendance(
                student_id=student.id,
                date=datetime.now() - timedelta(days=random.randint(1, 90)),
                status=random.choices(statuses, weights=[0.8, 0.15, 0.05])[0]
            )
            db.add(attendance)
    
    db.commit()
    print("Database seeded successfully!")

if __name__ == "__main__":
    from session import SessionLocal, init_db
    
    init_db()
    db = SessionLocal()
    seed_database(db)
