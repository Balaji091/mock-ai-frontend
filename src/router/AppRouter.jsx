import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../shared/constants/routes.js';

// Layout
import DashboardLayout from '../layouts/DashboardLayout.jsx';

// Components
import ProtectedRoute from '../shared/components/ProtectedRoute.jsx';

// Pages
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import CreateInterviewPage from '../pages/CreateInterviewPage.jsx';
import InterviewPage from '../pages/InterviewPage.jsx';
import ResultPage from '../pages/ResultPage.jsx';
import HistoryPage from '../pages/HistoryPage.jsx';
import AnalyticsPage from '../pages/AnalyticsPage.jsx';
import LandingPage from '../pages/LandingPage.jsx';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.LANDING} element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Private Dashboard Routes */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CREATE_INTERVIEW}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CreateInterviewPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.INTERVIEW}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <InterviewPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.RESULT}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ResultPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.HISTORY}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <HistoryPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ANALYTICS}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AnalyticsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
