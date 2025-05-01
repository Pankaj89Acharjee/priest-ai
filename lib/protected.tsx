'use client';

import { useAuth } from './authContext';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

// For routes that require authentication
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/auth/login'
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    redirect(redirectTo);
    return null;
  }

  return <>{children}</>;
};

// For priest-only routes
export const PriestRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/dashboard/user'
}) => {
  const { user, loading, isPriest } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    redirect('/auth/login');
    return null;
  }

  if (!isPriest) {
    redirect(redirectTo);
    return null;
  }

  return <>{children}</>;
};

// For user-only routes (non-priest)
export const UserRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/dashboard/priest'
}) => {
  const { user, loading, isPriest } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    redirect('/auth/login');
    return null;
  }

  if (isPriest) {
    redirect(redirectTo);
    return null;
  }

  return <>{children}</>;
};