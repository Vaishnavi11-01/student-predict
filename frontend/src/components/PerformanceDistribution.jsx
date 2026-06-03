import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { getStudents } from '../api/api';

const COLORS = {
  excellent: '#10B981',
  good: '#3B82F6',
  average: '#F59E0B',
  poor: '#EF4444'
};

export default function PerformanceDistribution() {
  const [data, setData] = useState([
    { name: 'Excellent', value: 15, color: COLORS.excellent },
    { name: 'Good', value: 35, color: COLORS.good },
    { name: 'Average', value: 30, color: COLORS.average },
    { name: 'Poor', value: 20, color: COLORS.poor }
  ]);

  useEffect(() => {
    // Fetch real data from backend
    getStudents()
      .then(res => res.data)
      .then(students => {
        const distribution = { excellent: 0, good: 0, average: 0, poor: 0 };
        
        students.forEach(student => {
          if (student.latest_prediction && student.latest_prediction.perf_category) {
            const category = student.latest_prediction.perf_category.toLowerCase();
            if (distribution[category] !== undefined) {
              distribution[category]++;
            }
          }
        });

        setData([
          { name: 'Excellent', value: distribution.excellent, color: COLORS.excellent },
          { name: 'Good', value: distribution.good, color: COLORS.good },
          { name: 'Average', value: distribution.average, color: COLORS.average },
          { name: 'Poor', value: distribution.poor, color: COLORS.poor }
        ]);
      })
      .catch(err => console.error('Error fetching performance distribution:', err));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6"
    >
      <h3 className="text-xl font-bold mb-4">Performance Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
