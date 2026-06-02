import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Filter, Search } from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearch] = useState('');

  useEffect(() => {
    // Fetch reports data from backend
    fetch('http://localhost:8000/students/')
      .then(res => res.json())
      .then(data => {
        const reportData = data.map(student => ({
          id: student.id,
          title: `${student.name} - Performance Report`,
          date: new Date().toISOString().split('T')[0],
          type: 'Performance',
          status: 'Ready'
        }));
        setReports(reportData);
      })
      .catch(err => console.error('Error fetching reports:', err));
  }, []);

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-gray-400">Generate and download performance reports</p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-6 flex gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-accent-cyan"
            placeholder="Search reports..."
          />
        </div>
        <button className="flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 hover:border-accent-cyan transition-colors">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </motion.div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="glass-card p-4 flex items-center justify-between hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-cyan/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent-cyan" />
              </div>
              <div>
                <h3 className="font-semibold">{report.title}</h3>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>{report.date}</span>
                  <span>{report.type}</span>
                  <span className="text-accent-green">{report.status}</span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-accent-cyan/20 text-accent-cyan px-4 py-2 rounded-lg hover:bg-accent-cyan/30 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
