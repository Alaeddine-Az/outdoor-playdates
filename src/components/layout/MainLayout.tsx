
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, loading } = useAuth();

  // Show simple loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header is always rendered and always sticky */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <main className="flex-1">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default MainLayout;
