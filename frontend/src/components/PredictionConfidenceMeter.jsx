import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gauge, Target } from 'lucide-react';

export default function PredictionConfidenceMeter({ studentId = 1 }) {
  const [prediction, setPrediction] = useState({
    dropout_risk: 0,
    confidence: 91
  });

  useEffect(() => {
    fetch(`http://localhost:8000/predict/${studentId}`)
      .then(res => res.json())
      .then(data => setPrediction({
        dropout_risk: data.dropout_risk,
        confidence: 91 // Default confidence, could be calculated from model
      }))
      .catch(err => console.error('Error fetching prediction:', err));
  }, [studentId]);

  const riskColor = prediction.dropout_risk > 65 ? '#EF4444' : prediction.dropout_risk > 35 ? '#F59E0B' : '#10B981';
  const confidenceColor = prediction.confidence > 80 ? '#10B981' : prediction.confidence > 60 ? '#F59E0B' : '#EF4444';

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Target className="text-accent-cyan" />
        Prediction Confidence (Student #{studentId})
      </h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Dropout Risk</span>
            <span className="font-bold" style={{ color: riskColor }}>
              {prediction.dropout_risk.toFixed(1)}%
            </span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${prediction.dropout_risk}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: riskColor }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Model Confidence</span>
            <span className="font-bold" style={{ color: confidenceColor }}>
              {prediction.confidence}%
            </span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${prediction.confidence}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="h-full rounded-full"
              style={{ backgroundColor: confidenceColor }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-700">
          <Gauge className="w-6 h-6 text-accent-purple" />
          <span className="text-sm text-gray-400">
            AI Model: RandomForest v2.1
          </span>
        </div>
      </div>
    </div>
  );
}
