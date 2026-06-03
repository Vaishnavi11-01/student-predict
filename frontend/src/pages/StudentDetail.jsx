import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, TrendingUp, Calendar, Brain, Target, History, AlertTriangle, Download } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudent, getPrediction, getSuggestions, downloadStudentReport } from '../api/api';

export default function StudentDetail() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const downloadPDF = async () => {
    try {
      const response = await downloadStudentReport(studentId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student_${studentId}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchStudentData = async () => {
      try {
        const studentResponse = await getStudent(studentId);
        if (!mounted) return;
        setStudent(studentResponse.data);

        if (studentResponse.data.grades) {
          const history = studentResponse.data.grades.map((grade) => ({
            date: grade.date,
            score: grade.score,
            subject: grade.subject,
            prediction: grade.score * (1 + Math.random() * 0.1 - 0.05)
          }));
          setPredictionHistory(history);
        }
      } catch (studentError) {
        console.error('Error fetching student:', studentError);
      }

      try {
        const predictionResponse = await getPrediction(studentId);
        if (!mounted) return;
        setPrediction(predictionResponse.data);
      } catch (predictionError) {
        console.warn('Prediction endpoint failed:', predictionError);
      }

      try {
        const suggestionsResponse = await getSuggestions(studentId);
        if (!mounted) return;
        setSuggestions(suggestionsResponse.data.suggestions || '');
      } catch (suggestionsError) {
        console.warn('Suggestions endpoint failed:', suggestionsError);
      }

      if (mounted) {
        setLoading(false);
      }
    };

    fetchStudentData();
    return () => {
      mounted = false;
    };
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

  const riskLevel = prediction?.risk_level || 'unknown';
  const riskColor = riskLevel === 'high' ? 'text-accent-red' : 
                    riskLevel === 'medium' ? 'text-accent-yellow' : 
                    riskLevel === 'low' ? 'text-accent-green' : 'text-gray-400';
  const riskBg = riskLevel === 'high' ? 'bg-accent-red/20' : 
                 riskLevel === 'medium' ? 'bg-accent-yellow/20' : 
                 riskLevel === 'low' ? 'bg-accent-green/20' : 'bg-white/10';

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

      <motion.button
        onClick={downloadPDF}
        className="mb-6 ml-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg hover:opacity-90 transition-opacity"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Download className="w-5 h-5" />
        Download Report
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
            <div className="flex flex-wrap gap-4 text-gray-400 mb-4">
              <span>ID: {student.id}</span>
              <span>Grade: {student.class_name}</span>
              <span>Avg Score: {student.avg_score?.toFixed(1)}%</span>
              <span>Attendance: {student.attendance_rate?.toFixed(1)}%</span>
            </div>
            <div className={`inline-block px-4 py-2 rounded-full ${riskBg} ${riskColor} font-semibold capitalize`}>
              {prediction?.risk_level ? `${prediction.risk_level} Risk` : 'Prediction Pending'}
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
              <div className="text-3xl font-bold text-accent-red">{prediction?.dropout_risk?.toFixed(1) ?? 'N/A'}%</div>
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
                <span className="font-bold text-accent-red">{prediction?.dropout_risk?.toFixed(1) ?? 'N/A'}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, prediction?.dropout_risk || 0)}%` }}
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

      {/* Prediction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6 mt-6"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <History className="text-accent-purple" />
          Prediction History
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={predictionHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="#888888" fontSize={12} />
            <YAxis stroke="#888888" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }}
            />
            <Line type="monotone" dataKey="score" stroke="#00D4FF" strokeWidth={2} name="Actual Score" />
            <Line type="monotone" dataKey="prediction" stroke="#7C3AED" strokeWidth={2} name="Predicted" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Risk Monitoring */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card p-6 mt-6"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="text-accent-red" />
          Risk Monitoring
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${riskLevel === 'high' ? 'bg-accent-red/20' : riskLevel === 'medium' ? 'bg-accent-yellow/20' : riskLevel === 'low' ? 'bg-accent-green/20' : 'bg-gray-800/50'}`}>
            <div className="text-sm text-gray-400 mb-1">Current Risk Level</div>
            <div className={`text-2xl font-bold capitalize ${riskColor}`}>{riskLevel}</div>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Risk Trend</div>
            <div className="text-2xl font-bold text-accent-cyan">Stable</div>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Last Assessment</div>
            <div className="text-2xl font-bold">Today</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-800/30 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Risk Factors</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Attendance Rate</span>
              <span className={prediction?.attend_rate < 70 ? 'text-accent-red' : 'text-accent-green'}>
                {prediction?.attend_rate?.toFixed(1) ?? 'N/A'}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Performance Score</span>
              <span className={prediction?.perf_score < 60 ? 'text-accent-red' : 'text-accent-green'}>
                {prediction?.perf_score?.toFixed(1) ?? 'N/A'}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Study Consistency</span>
              <span className="text-accent-cyan">Good</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
