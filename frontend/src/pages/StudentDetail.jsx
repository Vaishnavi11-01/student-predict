import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, TrendingUp, Calendar, Brain, Target } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useNavigate, useParams } from 'react-router-dom';

export default function StudentDetail() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:8000/students/${studentId}`).then(res => res.json()),
      fetch(`http://localhost:8000/predict/${studentId}`).then(res => res.json()),
      fetch(`http://localhost:8000/suggestions/${studentId}`).then(res => res.json())
    ])
    .then(([studentData, predictionData, suggestionsData]) => {
      setStudent(studentData);
      setPrediction(predictionData);
      setSuggestions(suggestionsData.suggestions || []);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      setLoading(false);
    });
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Student not found</div>
      </div>
    );
  }

  const riskColor = prediction.risk_level === 'high' ? 'text-accent-red' : 
                    prediction.risk_level === 'medium' ? 'text-accent-yellow' : 'text-accent-green';
  const riskBg = prediction.risk_level === 'high' ? 'bg-accent-red/20' : 
                 prediction.risk_level === 'medium' ? 'bg-accent-yellow/20' : 'bg-accent-green/20';

  const gradeData = student.grades?.map(g => ({
    subject: g.subject,
    score: g.score
  })) || [];

  return (
    <div className="min-h-screen p-6">
      <motion.button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        whileHover={{ x: -5 }}
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </motion.button>

      {/* Student Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-6"
      >
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple flex items-center justify-center">
            <User className="w-12 h-12" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
            <div className="flex gap-4 text-gray-400 mb-4">
              <span>ID: {student.id}</span>
              <span>Grade: {student.grade}</span>
            </div>
            <div className={`inline-block px-4 py-2 rounded-full ${riskBg} ${riskColor} font-semibold capitalize`}>
              {prediction.risk_level} Risk
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-accent-cyan" />
            Performance Stats
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Performance Score</div>
              <div className="text-3xl font-bold">{prediction.perf_score?.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Attendance Rate</div>
              <div className="text-3xl font-bold">{prediction.attend_rate?.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Dropout Risk</div>
              <div className="text-3xl font-bold text-accent-red">{(prediction.dropout_risk * 100).toFixed(1)}%</div>
            </div>
          </div>
        </motion.div>

        {/* Subject Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="text-accent-purple" />
            Subject Performance
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="subject" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="score" fill="#00D4FF" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Brain className="text-accent-purple" />
            AI Analysis
          </h3>
          <div className="space-y-3">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No AI suggestions available</p>
            )}
          </div>
        </motion.div>

        {/* Prediction Meter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="text-accent-cyan" />
            Prediction Confidence
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Dropout Risk</span>
                <span className="font-bold text-accent-red">{(prediction.dropout_risk * 100).toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${prediction.dropout_risk * 100}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-accent-red rounded-full"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Model Confidence</span>
                <span className="font-bold text-accent-green">91%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '91%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-accent-green rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
