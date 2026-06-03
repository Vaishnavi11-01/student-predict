import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { ErrorToastContainer } from './components/ErrorToast';
import useErrorHandler from './hooks/useErrorHandler';
import Login from './pages/Login';
import ModernDashboard from './pages/ModernDashboard';
import StudentDetail from './pages/StudentDetail';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import PredictionForm from './pages/PredictionForm';

function App() {
  const { errors, addError, removeError } = useErrorHandler();

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ModernDashboard addError={addError} />} />
            <Route path="/student/:studentId" element={<StudentDetail addError={addError} />} />
            <Route path="/analytics" element={<Analytics addError={addError} />} />
            <Route path="/reports" element={<Reports addError={addError} />} />
            <Route path="/predict" element={<PredictionForm addError={addError} />} />
          </Routes>
        </div>
        <ErrorToastContainer errors={errors} onRemoveError={removeError} />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
