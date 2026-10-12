import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProblemsPage from './pages/ProblemsPage';
import WorkspacePage from './pages/WorkspacePage';
import TheoriesPage from './pages/TheoriesPage';
import TheoryDetailPage from './pages/TheoryDetailPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProblemsPage from './pages/admin/AdminProblemsPage';
import AdminTestCasesPage from './pages/admin/AdminTestCasesPage';
import AdminTheoriesPage from './pages/admin/AdminTheoriesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/roadmap" replace />} />
          <Route path="/roadmap" element={<ProblemsPage initialView="graph" />} />
          <Route path="/problems" element={<ProblemsPage initialView="accordion" />} />
          <Route path="/practice" element={<ProblemsPage initialView="accordion" />} />
          <Route path="/problems/:slug" element={<WorkspacePage />} />
          <Route path="/theories" element={<TheoriesPage />} />
          <Route path="/theories/:slug" element={<TheoryDetailPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="problems" element={<AdminProblemsPage />} />
            <Route path="testcases" element={<AdminTestCasesPage />} />
            <Route path="theories" element={<AdminTheoriesPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
          <Route path="/admin/login" element={<Navigate to="/admin" replace />} />

          <Route path="*" element={<Navigate to="/roadmap" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

