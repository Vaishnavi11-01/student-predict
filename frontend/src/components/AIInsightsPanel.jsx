import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingDown, Calendar, AlertCircle } from 'lucide-react';

const InsightCard = ({ icon: Icon, title, content, type, delay }) => {
  const typeConfig = {
    warning: {
      bg: 'bg-accent-red/10',
      border: 'border-accent-red',
      icon: 'text-accent-red'
    },
    info: {
      bg: 'bg-accent-cyan/10',
      border: 'border-accent-cyan',
      icon: 'text-accent-cyan'
    },
    success: {
      bg: 'bg-accent-green/10',
      border: 'border-accent-green',
      icon: 'text-accent-green'
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`glass-card p-4 border-l-4 ${config.border} ${config.bg} mb-4`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.icon} mt-1 flex-shrink-0`} />
        <div>
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm text-gray-300">{content}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function AIInsightsPanel() {
  const insights = [
    {
      icon: TrendingDown,
      title: 'Performance Decline Detected',
      content: 'Arjun Rao\'s Mathematics performance declined 18% over the last 3 tests.',
      type: 'warning',
      delay: 0
    },
    {
      icon: Calendar,
      title: 'Attendance Alert',
      content: 'Priya Sharma\'s attendance dropped below 75% this week.',
      type: 'warning',
      delay: 0.1
    },
    {
      icon: AlertCircle,
      title: 'Recommended Action',
      content: 'Schedule a 1-on-1 mentoring session for students showing declining trends.',
      type: 'info',
      delay: 0.2
    },
    {
      icon: Brain,
      title: 'AI Prediction',
      content: 'Based on current patterns, 3 students may need intervention within 2 weeks.',
      type: 'success',
      delay: 0.3
    }
  ];

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Brain className="text-accent-purple" />
        AI Insights Panel
      </h2>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <InsightCard
            key={index}
            icon={insight.icon}
            title={insight.title}
            content={insight.content}
            type={insight.type}
            delay={insight.delay}
          />
        ))}
      </div>
    </div>
  );
}
