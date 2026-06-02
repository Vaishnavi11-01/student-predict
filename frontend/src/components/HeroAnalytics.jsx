import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertTriangle, GraduationCap } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.05, y: -8 }}
    whileTap={{ scale: 0.95 }}
    transition={{ delay, duration: 0.5 }}
    className="gradient-card p-6 animate-float"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple flex items-center justify-center animate-pulse-glow`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className={`w-3 h-3 rounded-full ${color} animate-pulse`} />
    </div>
    <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: delay + 0.2, type: 'spring' }}
      className="text-4xl font-bold"
    >
      {value}
    </motion.div>
  </motion.div>
);

export default function HeroAnalytics() {
  const [stats, setStats] = useState({
    total_students: 0,
    avg_score: 0,
    attendance: 0,
    high_risk: 0
  });

  useEffect(() => {
    fetch('http://localhost:8000/analytics/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={Users}
        title="Total Students"
        value={stats.total_students}
        color="text-accent-cyan"
        delay={0}
      />
      <StatCard
        icon={TrendingUp}
        title="Avg Score"
        value={`${stats.avg_score}%`}
        color="text-accent-green"
        delay={0.1}
      />
      <StatCard
        icon={GraduationCap}
        title="Attendance"
        value={`${stats.attendance}%`}
        color="text-accent-purple"
        delay={0.2}
      />
      <StatCard
        icon={AlertTriangle}
        title="High Risk"
        value={stats.high_risk}
        color="text-accent-red"
        delay={0.3}
      />
    </div>
  );
}
