import pandas as pd
import numpy as np


# =====================================================
# HELPER FUNCTIONS
# =====================================================


def calculate_avg_score(df_grades: pd.DataFrame) -> float:
    """Calculate average score across all subjects."""
    if df_grades.empty:
        return 0.0
    return round(float(df_grades["score"].mean()), 2)


def calculate_attendance_rate(df_attendance: pd.DataFrame) -> float:
    """Calculate attendance percentage."""
    if df_attendance.empty:
        return 0.0
    present_count = (df_attendance["status"] == "present").sum()
    total = len(df_attendance)
    return round(float((present_count / total) * 100), 2)


def calculate_weak_subjects(df_grades: pd.DataFrame) -> int:
    """Count subjects with average score below 60."""
    if df_grades.empty:
        return 0
    subject_avg = df_grades.groupby("subject")["score"].mean()
    weak_count = (subject_avg < 60).sum()
    return int(weak_count)


def calculate_absence_streak(df_attendance: pd.DataFrame) -> int:
    """Calculate maximum consecutive absences."""
    if df_attendance.empty:
        return 0
    
    max_streak = streak = 0
    for status in df_attendance["status"]:
        if status == "absent":
            streak += 1
            max_streak = max(max_streak, streak)
        else:
            streak = 0
    
    return max_streak


def calculate_score_trend(df_grades: pd.DataFrame) -> float:
    """
    Calculate performance trend using slope.
    Positive slope  -> improving
    Negative slope  -> declining
    """
    scores = df_grades["score"].values
    
    if len(scores) < 2:
        return 0
    
    x = np.arange(len(scores))
    slope = np.polyfit(x, scores, 1)[0]
    
    return round(float(slope), 2)


# =====================================================
# MAIN FEATURE BUILDER
# =====================================================


def build_features(
    df_grades: pd.DataFrame,
    df_attendance: pd.DataFrame
) -> dict:
    features = {
        "avg_score": calculate_avg_score(df_grades),
        "attendance_rate": calculate_attendance_rate(df_attendance),
        "weak_subjects": calculate_weak_subjects(df_grades),
        "absence_streak": calculate_absence_streak(df_attendance),
        "score_trend": calculate_score_trend(df_grades)
    }
    return features


# =====================================================
# TESTING
# =====================================================


if __name__ == "__main__":
    # Dummy data for testing
    df_grades = pd.DataFrame({
        "subject": ["Math", "Science", "English", "Math", "Science"],
        "score": [65, 55, 70, 72, 58],
        "date": pd.date_range(start="2024-01-01", periods=5)
    })
    
    df_attendance = pd.DataFrame({
        "date": pd.date_range(start="2024-01-01", periods=7),
        "status": ["present", "present", "absent", "absent", "absent", "present", "present"]
    })
    
    student_features = build_features(df_grades, df_attendance)
    
    print("\nStudent Feature Engineering Output\n")
    print(student_features)
