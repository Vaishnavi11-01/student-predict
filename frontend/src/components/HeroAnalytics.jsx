import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertTriangle, GraduationCap } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-6 hover:scale-105 transition-transform duration-300"
  >
    <div className="flex items-center justify-between mb-4">
      <Icon className={`w-8 h-8 ${color}`} />
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={Users}
        title="Total Students"
        value="1,247"
        color="text-accent-cyan"
        delay={0}
      />
      <StatCard
        icon={TrendingUp}
        title="Avg Score"
        value="78.5%"
        color="text-accent-green"
        delay={0.1}
      />
      <StatCard
        icon={GraduationCap}
        title="Attendance"
        value="92.3%"
        color="text-accent-purple"
        delay={0.2}
      />
      <StatCard
        icon={AlertTriangle}
        title="High Risk"
        value="23"
        color="text-accent-red"
        delay={0.3}
      />
    </div>
  );
}
