import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const SubjectsTable = ({ grades }) => {
  if (!grades || grades.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No grade data available</p>
      </div>
    );
  }

  const getScoreIcon = (score) => {
    if (score >= 85) return <TrendingUp className="w-4 h-4 text-accent-green" />;
    if (score >= 60) return <Minus className="w-4 h-4 text-accent-yellow" />;
    return <TrendingDown className="w-4 h-4 text-accent-red" />;
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-accent-green';
    if (score >= 60) return 'text-accent-yellow';
    return 'text-accent-red';
  };

  const getScoreBackground = (score) => {
    if (score >= 85) return 'bg-accent-green/10';
    if (score >= 60) return 'bg-accent-yellow/10';
    return 'bg-accent-red/10';
  };

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent-cyan" />
          Subject Performance
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Exam Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {grades.map((grade, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{grade.subject}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getScoreBackground(grade.score)} ${getScoreColor(grade.score)}`}>
                    {getScoreIcon(grade.score)}
                    <span className="text-sm font-semibold">{grade.score.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300 capitalize">{grade.exam_type || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-400">{new Date(grade.date).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-xs font-medium capitalize ${getScoreColor(grade.score)}`}>
                    {grade.score >= 85 ? 'Excellent' : grade.score >= 60 ? 'Good' : 'Needs Improvement'}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectsTable;
