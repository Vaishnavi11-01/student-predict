import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Search, Bell, Moon, Sun, User, BarChart3, FileText, TrendingUp, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStudents } from '../api/api';
import HeroAnalytics from '../components/HeroAnalytics';
import AIRiskHeatmap from '../components/AIRiskHeatmap';
import AIInsightsPanel from '../components/AIInsightsPanel';
import PredictionConfidenceMeter from '../components/PredictionConfidenceMeter';
import StudentGrowthTimeline from '../components/StudentGrowthTimeline';
import PerformanceDistribution from '../components/PerformanceDistribution';
import RiskAnalysis from '../components/RiskAnalysis';
import ScoreTrends from '../components/ScoreTrends';
import AttendanceVsScore from '../components/AttendanceVsScore';
import StudentList from '../components/StudentList';
import BulkImportModal from '../components/BulkImportModal';

export default function ModernDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [importRefresh, setImportRefresh] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'Student Emma Johnson is at high risk', time: '2 hours ago', type: 'warning' },
    { id: 2, message: 'New prediction model available', time: '5 hours ago', type: 'info' },
    { id: 3, message: 'Grade 10 attendance dropped by 5%', time: '1 day ago', type: 'alert' }
  ]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Top Navbar */}
      <nav className={`mx-4 mt-4 p-4 flex items-center justify-between rounded-xl border transition-colors duration-300 ${isDarkMode ? 'glass-card' : 'bg-white border-gray-200 shadow-md'}`}>
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
              className={`rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-cyan w-64 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/50 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              value={searchTerm}
              onChange={async (e) => {
                const term = e.target.value;
                setSearchTerm(term);
                
                if (term.trim().length > 0) {
                  setIsSearching(true);
                  try {
                    const response = await getStudents();
                    const filtered = response.filter(student => 
                      student.name.toLowerCase().includes(term.toLowerCase())
                    );
                    setSearchResults(filtered);
                  } catch (error) {
                    console.error('Search failed:', error);
                    setSearchResults([]);
                  } finally {
                    setIsSearching(false);
                  }
                } else {
                  setSearchResults([]);
                }
              }}
            />
            {/* Search Results Dropdown */}
            {searchTerm && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {searchResults.map((student) => (
                  <motion.div
                    key={student.id}
                    whileHover={{ backgroundColor: 'rgba(31, 117, 255, 0.1)' }}
                    onClick={() => {
                      navigate(`/student/${student.id}`);
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    className="px-4 py-3 border-b border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="font-medium text-white">{student.name}</div>
                    <div className="text-xs text-gray-400">{student.class_name} - {student.section}</div>
                  </motion.div>
                ))}
              </div>
            )}
            {searchTerm && searchResults.length === 0 && !isSearching && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 px-4 py-3 text-sm text-gray-400">
                No students found
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsBulkImportOpen(true)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/50 border-gray-700 hover:border-accent-cyan' : 'bg-gray-50 border-gray-300 hover:border-accent-cyan'}`}
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm">Import</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/analytics')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/50 border-gray-700 hover:border-accent-cyan' : 'bg-gray-50 border-gray-300 hover:border-accent-cyan'}`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm">Analytics</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/reports')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/50 border-gray-700 hover:border-accent-cyan' : 'bg-gray-50 border-gray-300 hover:border-accent-cyan'}`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Reports</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/predict')}
            className="flex items-center gap-2 bg-gradient-to-r from-accent-cyan to-accent-purple text-white rounded-lg px-3 py-2 hover:opacity-90 transition-opacity"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Predict</span>
          </motion.button>
          
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            </motion.button>
            
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute right-0 top-full mt-2 w-80 rounded-lg shadow-xl z-50 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b cursor-pointer transition-colors duration-300 ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-100'}`}
                    >
                      <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{notification.message}</p>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className={`p-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <button className="text-sm text-accent-cyan hover:underline w-full text-left">
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400 hover:text-yellow-300 transition-colors" />
            )}
          </motion.button>
          
          {/* Profile Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowProfile(!showProfile)}
              className="w-8 h-8 rounded-full bg-accent-purple flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <User className="w-4 h-4" />
            </motion.button>
            
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl z-50 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Admin User</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>admin@edupulse.com</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => navigate('/profile')}
                    className={`w-full text-left px-3 py-2 text-sm rounded transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Profile Settings
                  </button>
                  <button className={`w-full text-left px-3 py-2 text-sm rounded transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'}`}>
                    Account Settings
                  </button>
                  <button className={`w-full text-left px-3 py-2 text-sm rounded transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'}`}>
                    Help & Support
                  </button>
                  <button className={`w-full text-left px-3 py-2 text-sm rounded transition-colors duration-300 ${isDarkMode ? 'text-red-400 hover:bg-gray-700/50' : 'text-red-600 hover:bg-gray-100'}`}>
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
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
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Student Performance Intelligence System</p>
        </motion.div>

        <HeroAnalytics />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIRiskHeatmap />
          <AIInsightsPanel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StudentGrowthTimeline />
          <div className="lg:col-span-2">
            <PredictionConfidenceMeter studentId={1} />
          </div>
        </div>

        <h2 className={`text-2xl font-bold mt-8 mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Analytics Dashboard</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceDistribution />
          <RiskAnalysis />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScoreTrends />
          <AttendanceVsScore />
        </div>

        <h2 className={`text-2xl font-bold mt-8 mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>All Students</h2>
        <StudentList key={importRefresh} />
      </div>

      <BulkImportModal 
        isOpen={isBulkImportOpen} 
        onClose={() => setIsBulkImportOpen(false)}
        onSuccess={() => setImportRefresh(prev => prev + 1)}
      />
    </div>
  );
}
