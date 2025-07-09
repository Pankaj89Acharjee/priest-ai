'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useRouter } from 'next/navigation';
import { FloatingNavMenu } from '@/components/FloatingNavMenu';

// Navigation items
const navigation = [
  { name: 'Home', href: '/dashboard', icon: '🏠' },
  { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
  { name: 'Priests', href: '/dashboard/priests', icon: '👨‍💼' },
  { name: 'Bookings', href: '/dashboard/bookings', icon: '📅' },
  { name: 'Reviews', href: '/dashboard/reviews', icon: '⭐' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await handleSignOut()
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <button onClick={() => setSidebarOpen(false)}>✕</button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${pathname === item.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
            >
              <span className="mr-3">🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* For Floating Nav Menu */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
      >
        <FloatingNavMenu />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center px-4">
            <h2 className="text-xl font-semibold">Dashboard</h2>
          </div>


          {/* <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav> */}



          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
            >
              <span className="mr-3">🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            ☰
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              {/* Add search or other header content here */}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Add notifications, profile dropdown, etc. here */}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 