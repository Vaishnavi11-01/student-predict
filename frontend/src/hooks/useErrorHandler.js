import { useState, useCallback, useRef } from 'react';

export const useErrorHandler = () => {
  const [errors, setErrors] = useState([]);
  const timeoutsRef = useRef({});

  const addError = useCallback((message, id = null) => {
    const errorId = id || Date.now();
    const newError = {
      id: errorId,
      message,
      timestamp: new Date()
    };

    setErrors(prev => [...prev, newError]);

    // Auto-remove error after 5 seconds
    if (timeoutsRef.current[errorId]) {
      clearTimeout(timeoutsRef.current[errorId]);
    }

    timeoutsRef.current[errorId] = setTimeout(() => {
      removeError(errorId);
    }, 5000);

    return errorId;
  }, []);

  const removeError = useCallback((id) => {
    setErrors(prev => prev.filter(error => error.id !== id));
    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }
  }, []);

  const clearAll = useCallback(() => {
    errors.forEach(error => {
      if (timeoutsRef.current[error.id]) {
        clearTimeout(timeoutsRef.current[error.id]);
      }
    });
    setErrors([]);
    timeoutsRef.current = {};
  }, [errors]);

  return {
    errors,
    addError,
    removeError,
    clearAll
  };
};

export default useErrorHandler;
