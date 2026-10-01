import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProblemsPage from './pages/ProblemsPage';
import WorkspacePage from './pages/WorkspacePage';
import TheoriesPage from './pages/TheoriesPage';
import TheoryDetailPage from './pages/TheoryDetailPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

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
        <Route path="*" element={<Navigate to="/roadmap" replace />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
