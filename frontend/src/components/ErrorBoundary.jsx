import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Update state so the next render will show the fallback UI
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Log error to console in development
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null
    });
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-900">
          <div className="glass-card p-8 max-w-md text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-accent-red/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-accent-red" />
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-400 mb-4">
              We encountered an unexpected error. Please try refreshing or returning to the dashboard.
            </p>

            {this.state.error && (
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-mono text-red-300 break-words overflow-hidden max-h-24 overflow-y-auto">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-accent-cyan to-accent-purple text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={this.handleHome}
                className="flex items-center gap-2 px-6 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:border-accent-cyan transition-colors"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>

            {this.state.errorCount > 3 && (
              <p className="text-xs text-gray-500 mt-6">
                Multiple errors detected. Please contact support if the problem persists.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
