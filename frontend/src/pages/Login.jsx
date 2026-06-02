import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // For demo purposes, just navigate to dashboard
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple flex items-center justify-center">
            <Brain className="w-8 h-8" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2">EduPulse AI</h1>
        <p className="text-gray-400 text-center mb-8">Student Performance Intelligence</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-accent-cyan"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-accent-cyan"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Sign In
          </motion.button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Demo: Enter any email and password to continue
        </p>
      </motion.div>
    </div>
  );
}
