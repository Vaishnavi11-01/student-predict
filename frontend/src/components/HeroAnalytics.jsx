import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertTriangle, GraduationCap, Loader } from 'lucide-react';
import { getAnalyticsStats, getStudents } from '../api/api';

const StatCard = ({ icon: Icon, title, value, color, delay, loading }) => (
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
      {loading ? <Loader className="w-6 h-6 animate-spin" /> : value}
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await getAnalyticsStats();
        const statsData = response.data || {};
        
        let finalStats = {
          total_students: statsData.total_students || 0,
          avg_score: statsData.avg_score || 0,
          attendance: statsData.attendance || 0,
          high_risk: statsData.high_risk || 0
        };

        // If total_students is 0, always fetch from students endpoint
        if (finalStats.total_students === 0) {
          try {
            const studentsResponse = await getStudents();
            const studentsList = studentsResponse.data || [];
            finalStats.total_students = studentsList.length;
          } catch (studentsErr) {
            console.warn('Could not fetch students count:', studentsErr);
          }
        }

        setStats(finalStats);
      } catch (err) {
        console.error('Error fetching stats:', err);
        
        // Final fallback: try to get student count
        try {
          const studentsResponse = await getStudents();
          const studentsList = studentsResponse.data || [];
          setStats(prev => ({
            ...prev,
            total_students: studentsList.length
          }));
        } catch (studentsErr) {
          console.error('Error fetching students fallback:', studentsErr);
        }
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={Users}
        title="Total Students"
        value={stats.total_students}
        color="text-accent-cyan"
        delay={0}
        loading={loading}
      />
      <StatCard
        icon={TrendingUp}
        title="Avg Score"
        value={`${stats.avg_score}%`}
        color="text-accent-green"
        delay={0.1}
        loading={loading}
      />
      <StatCard
        icon={GraduationCap}
        title="Attendance"
        value={`${stats.attendance}%`}
        color="text-accent-purple"
        delay={0.2}
        loading={loading}
      />
      <StatCard
        icon={AlertTriangle}
        title="High Risk"
        value={stats.high_risk}
        color="text-accent-red"
        delay={0.3}
        loading={loading}
      />
    </div>
  );
}
