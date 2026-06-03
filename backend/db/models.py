from sqlalchemy import Column, Integer, String, Float, Date, Enum, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    class_name = Column(String, nullable=False)
    section = Column(String)
    parent_phone = Column(String)
    parent_email = Column(String)
    income_tier = Column(Integer)  # 1–5
    avg_score = Column(Float, default=0.0)
    attendance_rate = Column(Float, default=0.0)
    weak_subjects = Column(String, default="")
    
    grades = relationship("Grade", back_populates="student")
    attendance = relationship("Attendance", back_populates="student")
    predictions = relationship("Prediction", back_populates="student")

class Grade(Base):
    __tablename__ = "grades"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    subject = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    exam_type = Column(String)  # unit_test, midterm, final, homework
    date = Column(Date, default=datetime.utcnow)
    
    student = relationship("Student", back_populates="grades")

class Attendance(Base):
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    date = Column(Date, default=datetime.utcnow)
    status = Column(Enum("present", "absent", "late", name="status"), nullable=False)
    
    student = relationship("Student", back_populates="attendance")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    perf_score = Column(Float)  # predicted next exam score
    attend_rate = Column(Float)  # predicted 4-week attendance %
    dropout_risk = Column(Float)  # 0.0–1.0
    risk_level = Column(String)  # low / medium / high
    generated_at = Column(Date, default=datetime.utcnow)
    alerted = Column(Boolean, default=False)
    
    student = relationship("Student", back_populates="predictions")
