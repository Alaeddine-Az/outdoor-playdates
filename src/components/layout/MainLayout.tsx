
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <main className="flex-1 w-full max-w-full">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default MainLayout;
