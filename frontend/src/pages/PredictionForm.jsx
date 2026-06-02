import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowRight } from 'lucide-react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo purposes, navigate to a student detail page
    navigate('/student/1');
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
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-cyan"
              placeholder="Enter student name"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Grade/Class</label>
            <input
              type="text"
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-cyan"
              placeholder="e.g., 10th Grade"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Average Score (%)</label>
            <input
              type="number"
              value={formData.avgScore}
              onChange={(e) => setFormData({...formData, avgScore: e.target.value})}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-cyan"
              placeholder="0-100"
              min="0"
              max="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Attendance Rate (%)</label>
            <input
              type="number"
              value={formData.attendanceRate}
              onChange={(e) => setFormData({...formData, attendanceRate: e.target.value})}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-cyan"
              placeholder="0-100"
              min="0"
              max="100"
              required
            />
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
            className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Generate Prediction
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
