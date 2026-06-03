import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

export default function ErrorToast({ error, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 backdrop-blur-sm"
    >
      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-red-300 text-sm">{error.message}</p>
        <p className="text-red-200/50 text-xs mt-1">{error.timestamp?.toLocaleTimeString()}</p>
      </div>
      <button
        onClick={onClose}
        className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ErrorToastContainer({ errors, onRemoveError }) {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-40 max-w-md">
      <AnimatePresence>
        {errors.map((error) => (
          <ErrorToast
            key={error.id}
            error={error}
            onClose={() => onRemoveError(error.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
