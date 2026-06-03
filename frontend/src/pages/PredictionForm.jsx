import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, Loader } from 'lucide-react';
import { createStudent } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function PredictionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    avgScore: '',
    attendanceRate: '',
    weakSubjects: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Student name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Student name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      errors.name = 'Name must contain only letters and spaces';
    }
    
    // Grade validation
    if (!formData.grade.trim()) {
      errors.grade = 'Grade/Class is required';
    } else if (formData.grade.trim().length < 2) {
      errors.grade = 'Grade must be at least 2 characters';
    }
    
    // Average Score validation
    if (!formData.avgScore) {
      errors.avgScore = 'Average Score is required';
    } else {
      const score = Number(formData.avgScore);
      if (isNaN(score) || score < 0 || score > 100) {
        errors.avgScore = 'Average Score must be between 0 and 100';
      }
    }
    
    // Attendance Rate validation
    if (!formData.attendanceRate) {
      errors.attendanceRate = 'Attendance Rate is required';
    } else {
      const attendance = Number(formData.attendanceRate);
      if (isNaN(attendance) || attendance < 0 || attendance > 100) {
        errors.attendanceRate = 'Attendance Rate must be between 0 and 100';
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    const errors = validateForm();
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await createStudent({
        name: formData.name.trim(),
        class_name: formData.grade.trim(),
        section: '',
        parent_phone: '',
        parent_email: '',
        income_tier: 3,
        avg_score: Number(formData.avgScore),
        attendance_rate: Number(formData.attendanceRate),
        weak_subjects: formData.weakSubjects.trim()
      });
      navigate(`/student/${response.data.id}`);
    } catch (err) {
      console.error(err);
      setError('Unable to save student and generate prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Student Prediction</h1>
        <p className="text-gray-400">Enter student details to generate AI predictions</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 max-w-2xl mx-auto"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple flex items-center justify-center">
            <Brain className="w-8 h-8" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Student Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 focus:outline-none transition-colors ${validationErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-accent-cyan'}`}
              placeholder="Enter student name"
            />
            {validationErrors.name && <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Grade/Class</label>
            <input
              type="text"
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
              className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 focus:outline-none transition-colors ${validationErrors.grade ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-accent-cyan'}`}
              placeholder="e.g., 10th Grade"
            />
            {validationErrors.grade && <p className="text-red-400 text-sm mt-1">{validationErrors.grade}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Average Score (%)</label>
            <input
              type="number"
              value={formData.avgScore}
              onChange={(e) => setFormData({...formData, avgScore: e.target.value})}
              className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 focus:outline-none transition-colors ${validationErrors.avgScore ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-accent-cyan'}`}
              placeholder="0-100"
              min="0"
              max="100"
            />
            {validationErrors.avgScore && <p className="text-red-400 text-sm mt-1">{validationErrors.avgScore}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Attendance Rate (%)</label>
            <input
              type="number"
              value={formData.attendanceRate}
              onChange={(e) => setFormData({...formData, attendanceRate: e.target.value})}
              className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 focus:outline-none transition-colors ${validationErrors.attendanceRate ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-accent-cyan'}`}
              placeholder="0-100"
              min="0"
              max="100"
            />
            {validationErrors.attendanceRate && <p className="text-red-400 text-sm mt-1">{validationErrors.attendanceRate}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Weak Subjects (comma separated)</label>
            <input
              type="text"
              value={formData.weakSubjects}
              onChange={(e) => setFormData({...formData, weakSubjects: e.target.value})}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-cyan"
              placeholder="e.g., Math, Physics"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate Prediction
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-100">
            {error}
          </div>
        )}

      </motion.div>
    </div>
  );
}
