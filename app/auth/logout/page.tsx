'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { signOut } from '@/lib/auth';

export default function LogoutPage() {
  const router = useRouter();
  const { clearAuth } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut();
        clearAuth(); // Clear the auth context
        router.push('/'); // Redirect to home page
      } catch (error) {
        console.error('Error during logout:', error);
        router.push('/'); // Redirect to home even if there's an error
      }
    };

    handleLogout();
  }, [router, clearAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  );
}
