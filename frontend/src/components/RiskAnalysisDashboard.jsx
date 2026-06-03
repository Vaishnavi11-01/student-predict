import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle, Loader } from 'lucide-react';
import { getStudents, getAnalyticsStats } from '../api/api';

const RISK_COLORS = {
  high: '#ff4444',
  medium: '#ffcc44',
  low: '#44cc44'
};

export default function RiskAnalysisDashboard() {
  const [riskData, setRiskData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskData = async () => {
      setLoading(true);
      try {
        const response = await getStudents();
        const students = response;

        // Calculate risk distribution
        const getRisk = (score) => {
          if (score < 50) return 'high';
          if (score < 70) return 'medium';
          return 'low';
        };

        const riskCounts = {
          high: 0,
          medium: 0,
          low: 0
        };

        const riskScores = [];

        students.forEach(student => {
          const risk = getRisk(student.avg_score || 0);
          riskCounts[risk]++;
          riskScores.push({
            name: student.name,
            score: student.avg_score || 0,
            risk,
            attendance: student.attendance_rate || 0
          });
        });

        // Prepare chart data
        const pieData = [
          { name: 'Low Risk', value: riskCounts.low, color: RISK_COLORS.low },
          { name: 'Medium Risk', value: riskCounts.medium, color: RISK_COLORS.medium },
          { name: 'High Risk', value: riskCounts.high, color: RISK_COLORS.high }
        ].filter(item => item.value > 0);

        setChartData(pieData);
        setRiskData(riskScores.sort((a, b) => a.score - b.score));
      } catch (error) {
        console.error('Error fetching risk data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader className="w-8 h-8 animate-spin text-accent-cyan" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Risk Distribution Analysis</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} students`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          {chartData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold">{item.name}</span>
                </div>
                <span className="text-2xl font-bold">{item.value}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(item.value / riskData.length) * 100}%`
                  }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {((item.value / riskData.length) * 100).toFixed(1)}% of students
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* High Risk Students Table */}
      {riskData.some(s => s.risk === 'high') && (
        <div className="mt-8 pt-8 border-t border-gray-700">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            High Risk Students
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-3 text-gray-400">Name</th>
                  <th className="text-center py-2 px-3 text-gray-400">Avg Score</th>
                  <th className="text-center py-2 px-3 text-gray-400">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {riskData
                  .filter(s => s.risk === 'high')
                  .slice(0, 5)
                  .map((student) => (
                    <motion.tr
                      key={student.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-700/50 hover:bg-gray-800/30"
                    >
                      <td className="py-2 px-3">{student.name}</td>
                      <td className="text-center">{student.score.toFixed(1)}%</td>
                      <td className="text-center">{student.attendance.toFixed(1)}%</td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
