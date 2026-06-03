import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BookOpen, TrendingUp } from 'lucide-react';

export default function SubjectPerformance({ grades = [] }) {
  // Process grades data to show subject-wise performance
  const subjectData = grades.reduce((acc, grade) => {
    if (!acc[grade.subject]) {
      acc[grade.subject] = {
        subject: grade.subject,
        scores: [],
        avgScore: 0,
        examTypes: {}
      };
    }
    acc[grade.subject].scores.push(grade.score);
    acc[grade.subject].examTypes[grade.exam_type] = (acc[grade.subject].examTypes[grade.exam_type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.values(subjectData).map(subject => ({
    subject: subject.subject,
    average: subject.scores.reduce((a, b) => a + b, 0) / subject.scores.length,
    highest: Math.max(...subject.scores),
    lowest: Math.min(...subject.scores)
  }));

  if (chartData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-accent-cyan" />
          <h3 className="text-xl font-bold">Subject Performance</h3>
        </div>
        <p className="text-gray-400">No subject data available</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent-cyan" />
          <h3 className="text-xl font-bold">Subject Performance</h3>
        </div>
        <TrendingUp className="w-4 h-4 text-accent-green" />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="subject" 
            stroke="#888888" 
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#888888" fontSize={12} domain={[0, 100]} />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="average" name="Average Score" fill="#00D4FF" />
          <Bar dataKey="highest" name="Highest Score" fill="#10B981" />
          <Bar dataKey="lowest" name="Lowest Score" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>

      {/* Subject Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(subjectData).map((subject, index) => (
          <motion.div
            key={subject.subject}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
          >
            <h4 className="font-semibold text-white mb-2">{subject.subject}</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Average:</span>
                <span className="text-accent-cyan font-medium">
                  {(subject.scores.reduce((a, b) => a + b, 0) / subject.scores.length).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Highest:</span>
                <span className="text-accent-green font-medium">{Math.max(...subject.scores)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Lowest:</span>
                <span className="text-accent-red font-medium">{Math.min(...subject.scores)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Exams:</span>
                <span className="text-white">{subject.scores.length}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
