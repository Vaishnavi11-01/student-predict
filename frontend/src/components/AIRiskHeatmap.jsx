import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Shield, CheckCircle } from 'lucide-react';

const StudentRiskCard = ({ student, risk, delay }) => {
  const riskConfig = {
    high: {
      color: 'bg-accent-red/20',
      border: 'border-accent-red',
      icon: AlertCircle,
      textColor: 'text-accent-red'
    },
    medium: {
      color: 'bg-accent-yellow/20',
      border: 'border-accent-yellow',
      icon: Shield,
      textColor: 'text-accent-yellow'
    },
    low: {
      color: 'bg-accent-green/20',
      border: 'border-accent-green',
      icon: CheckCircle,
      textColor: 'text-accent-green'
    }
  };

  const config = riskConfig[risk] || riskConfig.low;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={`glass-card p-4 border-2 ${config.border} ${config.color} hover:scale-105 transition-all cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{student}</span>
        <Icon className={`w-5 h-5 ${config.textColor}`} />
      </div>
      <div className={`text-sm ${config.textColor} capitalize`}>
        {risk} Risk
      </div>
    </motion.div>
  );
};

export default function AIRiskHeatmap() {
  const students = [
    { name: 'Arjun Rao', risk: 'high' },
    { name: 'Priya Sharma', risk: 'medium' },
    { name: 'Rahul Kumar', risk: 'low' },
    { name: 'Sneha Patel', risk: 'high' },
    { name: 'Vikram Singh', risk: 'low' },
    { name: 'Anjali Gupta', risk: 'medium' },
    { name: 'Karan Mehta', risk: 'low' },
    { name: 'Ishita Joshi', risk: 'high' },
  ];

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <AlertCircle className="text-accent-cyan" />
        AI Risk Heatmap
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {students.map((student, index) => (
          <StudentRiskCard
            key={student.name}
            student={student.name}
            risk={student.risk}
            delay={index * 0.05}
          />
        ))}
      </div>
      <div className="mt-6 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-red" />
          <span className="text-gray-400">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-yellow" />
          <span className="text-gray-400">Medium Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-green" />
          <span className="text-gray-400">Low Risk</span>
        </div>
      </div>
    </div>
  );
}
