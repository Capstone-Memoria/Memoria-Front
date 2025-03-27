import LoginPage from '@/pages/LoginPage';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
