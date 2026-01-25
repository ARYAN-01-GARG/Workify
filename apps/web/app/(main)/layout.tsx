import React from 'react';
import MainLayout from '@/components/layout/main-layout';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default Layout;
