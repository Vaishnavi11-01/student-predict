# AI-Powered Academic Analytics Platform for Student Performance and Dropout Risk Prediction

An advanced AI-powered system to predict student academic performance, attendance trends, and dropout risk with multi-model intelligence and real-time analytics.

## Project Overview

Developed a machine learning model to predict student exam scores based on study hours, attendance, and previous performance. Implemented data preprocessing, feature selection, and regression algorithms using Python and Scikit-learn to ensure accurate predictions.

## Features

- **Dual ML Models**: Student performance prediction + Dropout risk detection
- **Real-Time Analytics**: Live dashboard with 4 chart types (Pie, Bar, Line, Scatter)
- **AI Insights Panel**: Data-driven insights with intelligent recommendations
- **JWT Authentication**: Secure login system with token-based auth
- **PDF Reports**: Generate student report cards, prediction reports, and analytics reports
- **Student Profiles**: Individual student pages with prediction history and risk monitoring
- **Modern UI**: Glassmorphism design with smooth animations and gradient cards
- **MongoDB Ready**: Cloud-ready NoSQL database infrastructure
- **Full-Stack Architecture**: React frontend + FastAPI backend + ML models

## Tech Stack

### Backend
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- SQLite (Database) + MongoDB (Ready for deployment)
- Scikit-learn (ML models)
- passlib & python-jose (JWT Authentication)
- reportlab (PDF generation)
- pymongo & motor (MongoDB integration)

### Frontend
- React (JavaScript framework)
- Tailwind CSS (Styling)
- Recharts (Data visualization)
- Framer Motion (Animations)
- Axios (API client)

## Project Structure

```
student-predict/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── requirements.txt      # Python dependencies
│   ├── render.yaml          # Render deployment config
│   ├── .env.example         # Environment variables template
│   ├── models/              # ML model files (.pkl)
│   ├── routers/             # API route handlers
│   ├── services/            # Business logic (predictions, auth, PDF)
│   ├── db/                  # Database models + MongoDB connection
│   ├── ml/                  # ML training scripts
│   └── dataset/             # Training data
├── frontend/
│   ├── src/
│   │   ├── components/      # React components (charts, cards, panels)
│   │   ├── pages/           # Page components (Dashboard, StudentDetail, Login)
│   │   ├── api/             # API client configuration
│   │   ├── index.css        # Global styles with glassmorphism
│   │   └── App.js           # React app entry point
│   ├── vercel.json          # Vercel deployment config
│   ├── .env.example         # Environment variables template
│   └── package.json
├── models/                  # ML models (student_model.pkl, dropout_model.pkl)
└── README.md
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
npm install
npm start
```

## Deployment

### Backend (Render)
- Connect GitHub repository to Render
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment variables: `SECRET_KEY`, `DATABASE_URL`, `MONGODB_URI`

### Frontend (Vercel)
- Connect GitHub repository to Vercel
- Root directory: `frontend`
- Build command: `npm run build`
- Environment variable: `REACT_APP_API_URL` (your Render backend URL)

## API Endpoints

### Students
- `GET /students/` - List all students
- `GET /students/{id}` - Get specific student

### Predictions
- `GET /predict/{student_id}` - Get predictions for a student
- `GET /predict/` - Get all predictions

### Analytics
- `GET /analytics/stats` - Get dashboard statistics

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Reports
- `GET /reports/student/{student_id}` - Download student report card PDF
- `GET /reports/predictions` - Download predictions report PDF
- `GET /reports/analytics` - Download analytics report PDF

### Suggestions
- `GET /suggestions/{student_id}` - Get AI study suggestions

## License

MIT
