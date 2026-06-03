import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { getPrediction } from '../api/api';

export default function PredictionHistory({ studentId }) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictionHistory = async () => {
      setLoading(true);
      try {
        const response = await getPrediction(studentId);
        // Since API returns single prediction, create mock history for demo
        const mockHistory = [
          {
            id: 1,
            date: '2026-06-03',
            perfScore: response.data?.perf_score || 75,
            attendRate: response.data?.attend_rate || 80,
            dropoutRisk: response.data?.dropout_risk || 0.2,
            riskLevel: response.data?.risk_level || 'low'
          },
          {
            id: 2,
            date: '2026-05-03',
            perfScore: 72,
            attendRate: 78,
            dropoutRisk: 0.25,
            riskLevel: 'low'
          },
          {
            id: 3,
            date: '2026-04-03',
            perfScore: 68,
            attendRate: 75,
            dropoutRisk: 0.35,
            riskLevel: 'medium'
          },
          {
            id: 4,
            date: '2026-03-03',
            perfScore: 65,
            attendRate: 72,
            dropoutRisk: 0.4,
            riskLevel: 'medium'
          },
          {
            id: 5,
            date: '2026-02-03',
            perfScore: 60,
            attendRate: 70,
            dropoutRisk: 0.5,
            riskLevel: 'medium'
          }
        ];
        setPredictions(mockHistory);
      } catch (error) {
        console.error('Error fetching prediction history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchPredictionHistory();
    }
  }, [studentId]);

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-500/10 border-red-500';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500';
      default:
        return 'bg-green-500/10 border-green-500';
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-accent-purple" />
          <h3 className="text-xl font-bold">Prediction History</h3>
        </div>
        <p className="text-gray-400">Loading...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <History className="w-5 h-5 text-accent-purple" />
        <h3 className="text-xl font-bold">Prediction History</h3>
      </div>

      <div className="space-y-4">
        {predictions.map((prediction, index) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getRiskColor(prediction.riskLevel)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getRiskIcon(prediction.riskLevel)}
                <span className="font-semibold text-white capitalize">
                  {prediction.riskLevel} Risk
                </span>
              </div>
              <span className="text-sm text-gray-400">{prediction.date}</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Predicted Score</p>
                <p className="text-lg font-bold text-accent-cyan">
                  {prediction.perfScore.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Attendance Rate</p>
                <p className="text-lg font-bold text-accent-purple">
                  {prediction.attendRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Dropout Risk</p>
                <p className="text-lg font-bold text-accent-red">
                  {(prediction.dropoutRisk * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Trend indicator */}
            {index < predictions.length - 1 && (
              <div className="mt-3 pt-3 border-t border-gray-700/50 flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span className="text-gray-400">
                  {prediction.perfScore > predictions[index + 1].perfScore ? (
                    <span className="text-green-400">Score improved by {(prediction.perfScore - predictions[index + 1].perfScore).toFixed(1)}%</span>
                  ) : (
                    <span className="text-red-400">Score decreased by {(predictions[index + 1].perfScore - prediction.perfScore).toFixed(1)}%</span>
                  )}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
        <h4 className="font-semibold text-white mb-3">Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Average Predicted Score</p>
            <p className="text-lg font-bold text-accent-cyan">
              {(predictions.reduce((a, b) => a + b.perfScore, 0) / predictions.length).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-gray-400">Average Dropout Risk</p>
            <p className="text-lg font-bold text-accent-red">
              {(predictions.reduce((a, b) => a + b.dropoutRisk, 0) / predictions.length * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-gray-400">Score Trend</p>
            <p className="text-lg font-bold text-accent-green">
              {predictions[0].perfScore > predictions[predictions.length - 1].perfScore ? '↑ Improving' : '↓ Declining'}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Risk Trend</p>
            <p className="text-lg font-bold text-accent-purple">
              {predictions[0].dropoutRisk < predictions[predictions.length - 1].dropoutRisk ? '↓ Decreasing' : '↑ Increasing'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
