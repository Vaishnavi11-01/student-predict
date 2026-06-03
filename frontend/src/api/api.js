import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error details
    const errorData = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.detail || error.message,
      timestamp: new Date().toISOString()
    };

    console.error('API Error:', errorData);

    // Handle specific error codes
    if (error.response?.status === 404) {
      console.warn('Resource not found (404):', error.config?.url);
    } else if (error.response?.status === 500) {
      console.error('Server error (500):', error.response?.data);
    } else if (error.response?.status === 400) {
      console.warn('Bad request (400):', error.response?.data?.detail);
    }

    // Network error
    if (!error.response && error.message === 'Network Error') {
      console.error('Network error - Backend may be unreachable');
      error.message = 'Unable to connect to server. Please check if the backend is running.';
    }

    return Promise.reject(error);
  }
);

export const getStudents = () => api.get('/students/');
export const getStudent = (id) => api.get(`/students/${id}`);
export const createStudent = (payload) => api.post('/students/', payload);
export const getPrediction = (id) => api.get(`/predict/${id}`);
export const getSuggestions = (id) => api.get(`/suggestions/${id}`);
export const submitPrediction = (payload) => api.post('/predict/manual', payload);
export const getAnalyticsStats = () => api.get('/analytics/stats');
export const downloadStudentReport = (id) => api.get(`/reports/student/${id}`, { responseType: 'blob' });
export const sendHighRiskAlerts = () => api.post('/notifications/send-high-risk-alerts');
export const sendStudentAlert = (studentId) => api.post(`/notifications/send-alert/${studentId}`);

// Safe wrapper for API calls with error handling
export const safeApiCall = async (apiFunction, errorMessage = 'An error occurred') => {
  try {
    const response = await apiFunction();
    return {
      success: true,
      data: response.data,
      error: null
    };
  } catch (error) {
    const errorDetail = error.response?.data?.detail || error.message || errorMessage;
    return {
      success: false,
      data: null,
      error: errorDetail
    };
  }
};

export default api;
