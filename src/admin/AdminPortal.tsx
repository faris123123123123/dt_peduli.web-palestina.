import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { api } from '../services/api';

interface Props {
  onBackToPublic: () => void;
  onRefreshPublicData?: () => void;
}

export const AdminPortal: React.FC<Props> = ({ onBackToPublic, onRefreshPublicData }) => {
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('dtp_admin_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    api.setActiveAdminRole(user.role);
    localStorage.setItem('dtp_admin_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dtp_admin_user');
  };

  // If not logged in, show isolated Login Gate
  if (!currentUser) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToPublic={onBackToPublic}
      />
    );
  }

  api.setActiveAdminRole(currentUser.role);

  // If authenticated, show isolated Admin Dashboard
  return (
    <AdminDashboard
      currentUser={currentUser}
      onLogout={handleLogout}
      onBackToPublic={onBackToPublic}
      onRefreshPublicData={onRefreshPublicData}
    />
  );
};
