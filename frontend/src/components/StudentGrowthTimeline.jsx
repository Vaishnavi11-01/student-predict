import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

const data = [
  { month: 'Jan', score: 65, attendance: 85 },
  { month: 'Feb', score: 68, attendance: 82 },
  { month: 'Mar', score: 72, attendance: 88 },
  { month: 'Apr', score: 70, attendance: 90 },
  { month: 'May', score: 75, attendance: 92 },
  { month: 'Jun', score: 78, attendance: 94 },
];

export default function StudentGrowthTimeline() {
  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp className="text-accent-green" />
        Student Growth Timeline
      </h2>
      
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-cyan" />
            <span className="text-sm text-gray-400">Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-purple" />
            <span className="text-sm text-gray-400">Attendance</span>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="#888888"
              fontSize={12}
            />
            <YAxis 
              stroke="#888888"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#00D4FF" 
              strokeWidth={2}
              dot={{ fill: '#00D4FF' }}
            />
            <Line 
              type="monotone" 
              dataKey="attendance" 
              stroke="#7C3AED" 
              strokeWidth={2}
              dot={{ fill: '#7C3AED' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-accent-green">+18%</div>
          <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Score Improvement
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent-cyan">+9%</div>
          <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
            <Calendar className="w-4 h-4" />
            Attendance Gain
          </div>
        </div>
      </div>
    </div>
  );
}
