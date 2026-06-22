import React, { useEffect } from 'react';
import AppRouter from './router/AppRouter.jsx';
import { useAuthStore } from './store/authStore.js';

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Run authentication checks for persistent user sessions
    checkAuth();
  }, [checkAuth]);

  return <AppRouter />;
};

export default App;
