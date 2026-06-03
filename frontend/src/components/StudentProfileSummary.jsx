import React from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, TrendingUp, Calendar, Phone, Mail, DollarSign, AlertTriangle } from 'lucide-react';

const StudentProfileSummary = ({ student, prediction, onClick }) => {
  if (!student) return null;

  const riskLevel = prediction?.risk_level || 'unknown';
  const riskColor = riskLevel === 'high' ? 'text-accent-red' : 
                    riskLevel === 'medium' ? 'text-accent-yellow' : 
                    riskLevel === 'low' ? 'text-accent-green' : 'text-gray-400';
  const riskBg = riskLevel === 'high' ? 'bg-accent-red/20' : 
                 riskLevel === 'medium' ? 'bg-accent-yellow/20' : 
                 riskLevel === 'low' ? 'bg-accent-green/20' : 'bg-gray-800/50';

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-accent-green';
    if (score >= 60) return 'text-accent-yellow';
    return 'text-accent-red';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0, 212, 255, 0.2)' }}
      onClick={onClick}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden cursor-pointer transition-all duration-300"
    >
      {/* Header with Avatar and Basic Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{student.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>ID: {student.id}</span>
              <span>•</span>
              <span>{student.class_name}</span>
              {student.section && <span>• {student.section}</span>}
            </div>
          </div>
          {riskLevel !== 'unknown' && (
            <div className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${riskBg} ${riskColor}`}>
              {riskLevel} Risk
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {/* Average Score */}
        <div className="bg-gray-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <TrendingUp className="w-3 h-3" />
            Avg Score
          </div>
          <div className={`text-xl font-bold ${getScoreColor(student.avg_score || 0)}`}>
            {student.avg_score?.toFixed(1)}%
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-gray-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Calendar className="w-3 h-3" />
            Attendance
          </div>
          <div className={`text-xl font-bold ${getScoreColor(student.attendance_rate || 0)}`}>
            {student.attendance_rate?.toFixed(1)}%
          </div>
        </div>

        {/* Performance Score */}
        {prediction && (
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <GraduationCap className="w-3 h-3" />
              Performance
            </div>
            <div className={`text-xl font-bold ${getScoreColor(prediction.perf_score || 0)}`}>
              {prediction.perf_score?.toFixed(1)}%
            </div>
          </div>
        )}

        {/* Dropout Risk */}
        {prediction && (
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <AlertTriangle className="w-3 h-3" />
              Dropout Risk
            </div>
            <div className={`text-xl font-bold ${riskColor}`}>
              {prediction.dropout_risk?.toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          {student.parent_phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {student.parent_phone}
            </span>
          )}
          {student.parent_email && (
            <span className="flex items-center gap-1 truncate">
              <Mail className="w-3 h-3" />
              {student.parent_email}
            </span>
          )}
          {student.income_tier && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Tier {student.income_tier}
            </span>
          )}
        </div>
      </div>

      {/* Weak Subjects Warning */}
      {student.weak_subjects && (
        <div className="px-4 pb-4">
          <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg p-2">
            <div className="flex items-center gap-2 text-xs text-accent-red">
              <AlertTriangle className="w-3 h-3" />
              <span className="font-medium">Weak Subjects:</span>
              <span>{student.weak_subjects}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StudentProfileSummary;
