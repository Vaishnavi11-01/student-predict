# Student Performance Prediction System

An AI-powered system to predict student academic performance, attendance trends, and dropout risk.

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
- PostgreSQL (Database)
- Celery (Background tasks)
- XGBoost, TensorFlow, scikit-learn (ML models)
- Anthropic Claude API (AI suggestions)
- Twilio, SendGrid (Alerts)

### Frontend
- React
- Recharts (Data visualization)
- Axios (API client)

## Project Structure

```
student-predict/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── models/              # ML model files (.pkl, .h5)
│   ├── routers/             # API route handlers
│   ├── services/            # Business logic (predictions, alerts)
│   ├── db/                  # Database models + migrations
│   ├── tasks.py             # Celery background jobs
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/           # Dashboard, ParentPortal, StudentDetail
│   │   ├── components/      # RiskBadge, AttendanceChart, SuggestionCard
│   │   └── api/             # Axios API calls
│   └── package.json
```

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## API Endpoints

- `GET /students` - List all students
- `GET /predict/{student_id}` - Get predictions for a student
- `GET /suggestions/{student_id}` - Get AI study suggestions

## License

MIT
