import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default MainLayout;
