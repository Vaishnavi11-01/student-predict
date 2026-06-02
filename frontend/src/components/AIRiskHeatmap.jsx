import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentRiskCard = ({ student, risk, delay, onClick }) => {
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
      onClick={onClick}
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
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/students/')
      .then(res => res.json())
      .then(data => {
        // Fetch predictions for each student
        const studentWithRisk = Promise.all(
          data.map(async (student) => {
            const predRes = await fetch(`http://localhost:8000/predict/${student.id}`);
            const predData = await predRes.json();
            return {
              name: student.name,
              id: student.id,
              risk: predData.risk_level
            };
          })
        );
        studentWithRisk.then(results => setStudents(results.slice(0, 8)));
      })
      .catch(err => console.error('Error fetching students:', err));
  }, []);

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <AlertCircle className="text-accent-cyan" />
        AI Risk Heatmap
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {students.map((student, index) => (
          <StudentRiskCard
            key={student.id}
            student={student.name}
            risk={student.risk}
            delay={index * 0.05}
            onClick={() => navigate(`/student/${student.id}`)}
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
