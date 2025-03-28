
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default MainLayout;
