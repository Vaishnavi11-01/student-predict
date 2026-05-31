import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getStudents = () => api.get('/students/');
export const getStudent = (id) => api.get(`/students/${id}`);
export const getPrediction = (id) => api.get(`/predict/${id}`);
export const getSuggestions = (id) => api.get(`/suggestions/${id}`);

export default api;
