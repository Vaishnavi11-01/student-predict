import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, Loader } from 'lucide-react';
import { getStudents } from '../api/api';

export default function PerformanceTrends() {
  const [trendData, setTrendData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('score');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendData = async () => {
      setLoading(true);
      try {
        const response = await getStudents();
        const students = response;

        // Sort by ID to simulate time progression
        const sorted = [...students].sort((a, b) => a.id - b.id);

        // Create trend data
        const trends = sorted.map((student, index) => ({
          id: student.id,
          name: student.name?.split(' ')[0],
          score: student.avg_score || 0,
          attendance: student.attendance_rate || 0,
          index: index + 1
        }));

        // Create scatter data for score vs attendance correlation
        const scatter = sorted.map(student => ({
          x: student.attendance_rate || 0,
          y: student.avg_score || 0,
          name: student.name,
          id: student.id
        }));

        setTrendData(trends);
        setScatterData(scatter);
      } catch (error) {
        console.error('Error fetching trend data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
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
      className="space-y-6"
    >
      {/* Trend Chart */}
      <motion.div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-accent-cyan" />
            Performance Trends
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMetric('score')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedMetric === 'score'
                  ? 'bg-accent-cyan text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Score
            </button>
            <button
              onClick={() => setSelectedMetric('attendance')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedMetric === 'attendance'
                  ? 'bg-accent-cyan text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Attendance
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1f75ff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1f75ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#9CA3AF"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              cursor={{ stroke: '#1f75ff' }}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke="#1f75ff"
              fillOpacity={1}
              fill="url(#colorMetric)"
              name={selectedMetric === 'score' ? 'Avg Score' : 'Attendance Rate'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Correlation Scatter Chart */}
      <motion.div className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-6">Score vs Attendance Correlation</h2>

        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              type="number"
              dataKey="x"
              name="Attendance %"
              stroke="#9CA3AF"
              domain={[0, 100]}
              label={{ value: 'Attendance Rate (%)', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Score %"
              stroke="#9CA3AF"
              domain={[0, 100]}
              label={{ value: 'Average Score (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              cursor={{ stroke: '#1f75ff' }}
            />
            <Scatter name="Students" data={scatterData} fill="#1f75ff" />
          </ScatterChart>
        </ResponsiveContainer>

        <div className="mt-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-sm text-gray-400">
          <p>
            The scatter plot shows the correlation between attendance rate and average score.
            Points higher and to the right indicate better performing students with good attendance.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
