import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

export default function BulkImportModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (e.dataTransfer.files[0].name.endsWith('.csv')) {
        setFile(e.dataTransfer.files[0]);
        setError('');
      } else {
        setError('Please upload a CSV file');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].name.endsWith('.csv')) {
        setFile(e.target.files[0]);
        setError('');
      } else {
        setError('Please select a CSV file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE_URL}/import/bulk-import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data);
      if (response.data.success && response.data.imported > 0 && onSuccess) {
        // Wait 2 seconds then close
        setTimeout(() => {
          onClose();
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to import students. Please check your CSV format.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = ['name', 'class_name', 'section', 'avg_score', 'attendance_rate', 'weak_subjects', 'parent_phone', 'parent_email', 'income_tier'];
    const sample = ['John Doe', '10th Grade', 'A', '85.5', '90.0', 'Math,Physics', '9876543210', 'john@example.com', '3'];
    
    const csv = [headers.join(','), sample.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_import_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card p-8 max-w-md w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Bulk Import Students</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-800 rounded transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {result ? (
            // Result view
            <div className="space-y-4">
              {result.success ? (
                <>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-200">Import Successful!</p>
                      <p className="text-sm text-green-300">{result.imported} students imported</p>
                    </div>
                  </div>

                  {result.failed > 0 && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-200">{result.failed} records failed</p>
                        {result.failed_records && result.failed_records.length > 0 && (
                          <ul className="text-xs text-yellow-300 mt-2 space-y-1">
                            {result.failed_records.map((record, idx) => (
                              <li key={idx}>{record}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-200">Import Failed</p>
                    <p className="text-sm text-red-300">{result.error || 'Unknown error'}</p>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          ) : (
            // Upload view
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-accent-cyan bg-accent-cyan/10'
                    : 'border-gray-700 bg-gray-800/50'
                }`}
              >
                <Upload className="w-8 h-8 mx-auto mb-3 text-accent-cyan" />
                <p className="text-gray-300 mb-2">Drag and drop your CSV file here</p>
                <p className="text-xs text-gray-500 mb-4">or</p>
                <label className="inline-block px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors cursor-pointer">
                  Select File
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {file && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm">
                  <p className="text-green-300">✓ {file.name}</p>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm">
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={downloadTemplate}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg hover:border-accent-cyan transition-colors text-sm"
                >
                  Download CSV Template
                </button>

                <button
                  onClick={handleUpload}
                  disabled={loading || !file}
                  className="w-full px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    'Import Students'
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                CSV must include: name, class_name, avg_score, attendance_rate
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
