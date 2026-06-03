import csv
import os
import random
import sys
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

# Ensure the backend package root is on sys.path when running this file directly.
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root not in sys.path:
    sys.path.insert(0, root)

from db.models import Student, Grade, Attendance, Prediction


def derive_risk_level(dropout_prob: float) -> str:
    if dropout_prob > 0.65:
        return "high"
    if dropout_prob > 0.35:
        return "medium"
    return "low"


def seed_database(db: Session):
    """Seed the database with real dataset values for testing."""
    dataset_path = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'student_data.csv')
    students = []

    if os.path.exists(dataset_path):
        with open(dataset_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            rows = [row for row in reader if row.get('StudyHours') and row.get('Attendance') and row.get('PreviousMarks') and row.get('AssignmentScore') and row.get('FinalScore')]

        if not rows:
            print(f"Dataset is empty or missing required columns: {dataset_path}")
            seed_random_data(db)
            return

        for index, row in enumerate(rows):
            try:
                attendance_pct = float(row['Attendance'])
                previous_marks = float(row['PreviousMarks'])
                assignment_score = float(row['AssignmentScore'])
                final_score = float(row['FinalScore'])
            except ValueError:
                continue

            student = Student(
                name=f"Student {index + 1}",
                class_name=random.choice(["Grade 10", "Grade 11", "Grade 12"]),
                section=random.choice(["A", "B", "C"]),
                parent_phone=f"+123456789{index + 1}",
                parent_email=f"parent{index + 1}@example.com",
                income_tier=random.randint(1, 5)
            )
            db.add(student)
            students.append((student, attendance_pct, previous_marks, assignment_score, final_score))

        db.commit()

        subjects = ["Math", "Science", "English", "History"]
        exam_types = ["unit_test", "midterm", "final", "homework"]

        for student, attendance_pct, previous_marks, assignment_score, final_score in students:
            for subject in subjects:
                score = min(100, max(0, previous_marks + random.uniform(-12, 12)))
                grade = Grade(
                    student_id=student.id,
                    subject=subject,
                    score=round(score, 1),
                    exam_type=random.choice(exam_types),
                    date=datetime.now() - timedelta(days=random.randint(1, 365))
                )
                db.add(grade)

            total_days = 90
            present_count = max(0, min(total_days, int(total_days * attendance_pct / 100)))
            statuses = ["present"] * present_count + ["absent"] * (total_days - present_count)
            random.shuffle(statuses)

            for day_index, status in enumerate(statuses):
                attendance = Attendance(
                    student_id=student.id,
                    date=datetime.now() - timedelta(days=day_index),
                    status=status
                )
                db.add(attendance)

            dropout_prob = max(0.0, min(1.0, 1 - (attendance_pct / 100) + random.uniform(-0.05, 0.05)))
            prediction = Prediction(
                student_id=student.id,
                perf_score=round(final_score, 1),
                attend_rate=round(attendance_pct, 1),
                dropout_risk=round(dropout_prob, 3),
                risk_level=derive_risk_level(dropout_prob),
                generated_at=datetime.now()
            )
            db.add(prediction)

        db.commit()
        print("Database seeded from student_data.csv successfully!")
    else:
        print(f"Dataset not found at {dataset_path}. Falling back to random sample seeding.")
        seed_random_data(db)


def seed_random_data(db: Session):
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

    subjects = ["Math", "Science", "English", "History", "Physics"]
    exam_types = ["unit_test", "midterm", "final", "homework"]

    for student in students:
        for _ in range(20):
            grade = Grade(
                student_id=student.id,
                subject=random.choice(subjects),
                score=random.uniform(40, 100),
                exam_type=random.choice(exam_types),
                date=datetime.now() - timedelta(days=random.randint(1, 365))
            )
            db.add(grade)

    for student in students:
        for _ in range(90):
            attendance = Attendance(
                student_id=student.id,
                date=datetime.now() - timedelta(days=random.randint(1, 90)),
                status=random.choices(["present", "absent", "late"], weights=[0.8, 0.15, 0.05])[0]
            )
            db.add(attendance)

    db.commit()
    print("Database seeded with random synthetic data.")


if __name__ == "__main__":
    from db.session import SessionLocal, init_db

    init_db()
    db = SessionLocal()
    seed_database(db)
