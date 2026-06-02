import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ModernDashboard from './pages/ModernDashboard';
import StudentDetail from './pages/StudentDetail';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import PredictionForm from './pages/PredictionForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ModernDashboard />} />
          <Route path="/student/:studentId" element={<StudentDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/predict" element={<PredictionForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
