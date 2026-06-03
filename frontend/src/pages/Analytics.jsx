import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { getStudents } from '../api/api';
import RiskAnalysisDashboard from '../components/RiskAnalysisDashboard';
import PerformanceTrends from '../components/PerformanceTrends';

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    scoreTrends: [],
    attendanceAnalysis: [],
    performanceDistribution: []
  });

  useEffect(() => {
    // Fetch analytics data from backend
    getStudents()
      .then(res => res.data)
      .then(data => {
        // Process data for charts
        const scoreTrends = data.map(s => ({
          name: s.name,
          score: s.grades?.[0]?.score || 0
        }));

        const attendanceAnalysis = data.map(s => ({
          name: s.name,
          attendance: s.attendance?.length || 0
        }));

        const performanceDistribution = [
          { name: 'Excellent', value: data.filter(s => s.grades?.[0]?.score > 80).length },
          { name: 'Good', value: data.filter(s => s.grades?.[0]?.score > 60 && s.grades?.[0]?.score <= 80).length },
          { name: 'Average', value: data.filter(s => s.grades?.[0]?.score > 40 && s.grades?.[0]?.score <= 60).length },
          { name: 'Below Average', value: data.filter(s => s.grades?.[0]?.score <= 40).length }
        ];

        setAnalyticsData({
          scoreTrends,
          attendanceAnalysis,
          performanceDistribution
        });
      })
      .catch(err => console.error('Error fetching analytics:', err));
  }, []);

  const COLORS = ['#00D4FF', '#7C3AED', '#10B981', '#EF4444'];

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-400">Comprehensive performance analysis</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-accent-cyan" />
            Score Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.scoreTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="score" stroke="#00D4FF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Attendance Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="text-accent-purple" />
            Attendance Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.attendanceAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="attendance" fill="#7C3AED" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="text-accent-green" />
            Performance Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.performanceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.performanceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Enhanced Visualizations */}
      <div className="mt-8 space-y-8">
        <RiskAnalysisDashboard />
        <PerformanceTrends />
      </div>
    </div>
  );
}
