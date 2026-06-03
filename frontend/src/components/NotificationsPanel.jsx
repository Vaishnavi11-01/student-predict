import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send, AlertTriangle, Loader } from 'lucide-react';
import { sendHighRiskAlerts } from '../api/api';

export default function NotificationsPanel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSendAlerts = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await sendHighRiskAlerts();
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send alerts. Email service may not be configured.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6 text-accent-cyan" />
        <h2 className="text-2xl font-bold">Parent Notifications</h2>
      </div>

      <div className="space-y-4">
        <p className="text-gray-400">
          Send email notifications to parents of students flagged with high academic risk. Ensure parent email addresses are configured in student profiles.
        </p>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <p className={result.success ? 'text-green-300' : 'text-red-300'}>
              {result.message || `Alerts sent: ${result.sent}, Failed: ${result.failed}`}
            </p>
            {result.total_high_risk_students && (
              <p className="text-sm text-gray-400 mt-2">
                Total high-risk students: {result.total_high_risk_students}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-300 font-semibold">Configuration Required</p>
              <p className="text-sm text-yellow-200">{error}</p>
              <p className="text-xs text-yellow-300 mt-2">
                To enable email notifications, set the following environment variables on your server:
                <br/>SMTP_SERVER, SMTP_PORT, SENDER_EMAIL, SENDER_PASSWORD
              </p>
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSendAlerts}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Sending Alerts...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send High-Risk Alerts
            </>
          )}
        </motion.button>

        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
          <h3 className="font-semibold mb-2">How it works:</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>✓ Identifies all students with "high" risk level</li>
            <li>✓ Sends personalized email to parent contact</li>
            <li>✓ Includes dropout risk score and suggestions</li>
            <li>✓ Professional HTML formatted emails</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
