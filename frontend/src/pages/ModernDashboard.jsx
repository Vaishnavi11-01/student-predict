import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Search, Bell, Moon, User } from 'lucide-react';
import HeroAnalytics from '../components/HeroAnalytics';
import AIRiskHeatmap from '../components/AIRiskHeatmap';
import AIInsightsPanel from '../components/AIInsightsPanel';
import PredictionConfidenceMeter from '../components/PredictionConfidenceMeter';
import StudentGrowthTimeline from '../components/StudentGrowthTimeline';

export default function ModernDashboard() {
  return (
    <div className="min-h-screen">
      {/* Top Navbar */}
      <nav className="glass-card mx-4 mt-4 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
            EduPulse AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student..."
              className="bg-gray-800/50 border border-gray-700 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-cyan w-64"
            />
          </div>
          <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
          <Moon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
          <div className="w-8 h-8 rounded-full bg-accent-purple flex items-center justify-center cursor-pointer">
            <User className="w-4 h-4" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Student Performance Intelligence System</p>
        </motion.div>

        <HeroAnalytics />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIRiskHeatmap />
          <AIInsightsPanel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StudentGrowthTimeline />
          <div className="lg:col-span-2">
            <PredictionConfidenceMeter risk={38} confidence={91} />
          </div>
        </div>
      </div>
    </div>
  );
}
