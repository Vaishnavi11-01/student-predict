# Student Performance Prediction System

An AI-powered system to predict student academic performance, attendance trends, and dropout risk.

## Project Overview

Developed a machine learning model to predict student exam scores based on study hours, attendance, and previous performance. Implemented data preprocessing, feature selection, and regression algorithms using Python and Scikit-learn to ensure accurate predictions.

## Features

- **Performance Prediction**: Predicts next exam scores using XGBoost
- **Attendance Forecasting**: LSTM-based attendance trend prediction
- **Dropout Risk Assessment**: Random Forest classifier for risk evaluation
- **AI Study Suggestions**: Personalized recommendations using Claude API
- **Automated Alerts**: SMS/Email notifications for high-risk students
- **Teacher Dashboard**: Class-level risk overview
- **Parent Portal**: Child progress tracking and tips

## Tech Stack

### Backend
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- SQLite (Database)
- XGBoost, scikit-learn (ML models)
- Anthropic Claude API (AI suggestions)
- Twilio, SendGrid (Alerts)

### Frontend
- HTML/JavaScript Dashboard
- Simple HTTP Server

## Project Structure

```
student-predict/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── models/              # ML model files (.pkl)
│   ├── routers/             # API route handlers
│   ├── services/            # Business logic (predictions, alerts)
│   ├── db/                  # Database models + migrations
│   ├── ml/                  # ML training scripts
│   └── requirements.txt
├── frontend/
│   ├── simple-dashboard.html # HTML dashboard
│   └── package.json
```

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
python -m http.server 3000
```

## API Endpoints

- `GET /students` - List all students
- `GET /predict/{student_id}` - Get predictions for a student
- `GET /suggestions/{student_id}` - Get AI study suggestions

## License

MIT
