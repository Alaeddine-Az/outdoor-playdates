
import React, { ReactNode } from 'react';
import AppLayout from './AppLayout';

interface AppLayoutWrapperProps {
  children: ReactNode;
}

/**
 * A wrapper around AppLayout that explicitly accepts children.
 * This solves TypeScript errors when passing children to AppLayout.
 */
const AppLayoutWrapper: React.FC<AppLayoutWrapperProps> = ({ children }) => {
  return <AppLayout>{children}</AppLayout>;
};

export default AppLayoutWrapper;
