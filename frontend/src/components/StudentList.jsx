import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, Loader, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStudents } from '../api/api';

export default function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name'); // name, avgScore, attendanceRate
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [filterRisk, setFilterRisk] = useState('all'); // all, high, medium, low
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await getStudents();
        const studentsData = response.data || [];
        setStudents(Array.isArray(studentsData) ? studentsData : []);
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const getRiskLevel = (avgScore) => {
    if (avgScore < 50) return 'high';
    if (avgScore < 70) return 'medium';
    return 'low';
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-500/10 border-red-500/30 text-red-300';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300';
      case 'low':
        return 'bg-green-500/10 border-green-500/30 text-green-300';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-300';
    }
  };

  // Filter students
  let filteredStudents = Array.isArray(students) ? students.filter(student => {
    const matchesText = student.name.toLowerCase().includes(filterText.toLowerCase()) ||
                       student.class_name.toLowerCase().includes(filterText.toLowerCase());
    
    if (filterRisk !== 'all') {
      const risk = getRiskLevel(student.avg_score || 0);
      return matchesText && risk === filterRisk;
    }
    
    return matchesText;
  }) : [];

  // Sort students
  filteredStudents.sort((a, b) => {
    let aVal, bVal;
    
    switch (sortBy) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'avgScore':
        aVal = a.avg_score || 0;
        bVal = b.avg_score || 0;
        break;
      case 'attendance':
        aVal = a.attendance_rate || 0;
        bVal = b.attendance_rate || 0;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader className="w-8 h-8 animate-spin text-accent-cyan" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Student List</h2>

      {/* Filter and Sort Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or class..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-accent-cyan"
        />

        {/* Risk Filter */}
        <select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
          className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-accent-cyan flex items-center gap-2"
        >
          <option value="all">All Risk Levels</option>
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
        </select>

        {/* Sort */}
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-accent-cyan"
          >
            <option value="name">Sort by Name</option>
            <option value="avgScore">Sort by Score</option>
            <option value="attendance">Sort by Attendance</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-accent-cyan transition-colors"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            <ArrowUpDown className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Student Table */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No students found matching your filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400">Name</th>
                <th className="text-left py-3 px-4 text-gray-400">Class</th>
                <th className="text-center py-3 px-4 text-gray-400">Avg Score</th>
                <th className="text-center py-3 px-4 text-gray-400">Attendance</th>
                <th className="text-center py-3 px-4 text-gray-400">Risk Level</th>
                <th className="text-center py-3 px-4 text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => {
                const riskLevel = getRiskLevel(student.avg_score || 0);
                return (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium">{student.name}</td>
                    <td className="py-4 px-4 text-gray-400">{student.class_name}</td>
                    <td className="py-4 px-4 text-center">{(student.avg_score || 0).toFixed(1)}%</td>
                    <td className="py-4 px-4 text-center">{(student.attendance_rate || 0).toFixed(1)}%</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full border text-xs font-medium ${getRiskColor(riskLevel)} capitalize`}>
                        {riskLevel}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/student/${student.id}`)}
                        className="px-3 py-1 bg-gradient-to-r from-accent-cyan to-accent-purple rounded text-sm hover:opacity-90 transition-opacity"
                      >
                        View
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-400">
        Showing {filteredStudents.length} of {students.length} students
      </div>
    </motion.div>
  );
}
