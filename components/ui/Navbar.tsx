// components/ui/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { signOut } from '@/lib/auth';

const Navbar = () => {
  const { user, loading, isPriest } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow dark:bg-gray-900'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              PriestConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link 
              href="/" 
              className={`hover:text-indigo-600 transition ${
                pathname === '/' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              href="/priests" 
              className={`hover:text-indigo-600 transition ${
                pathname === '/priests' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Find Priests
            </Link>
            <Link 
              href="/services" 
              className={`hover:text-indigo-600 transition ${
                pathname === '/services' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className={`hover:text-indigo-600 transition ${
                pathname === '/about' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              About
            </Link>
          </div>

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={isPriest ? '/dashboard/priest' : '/dashboard/user'}
                  className="text-indigo-600 hover:text-indigo-800 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-indigo-600 hover:text-indigo-800 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-200 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              ) : (
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link 
              href="/" 
              className={`block hover:text-indigo-600 transition ${
                pathname === '/' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              href="/priests" 
              className={`block hover:text-indigo-600 transition ${
                pathname === '/priests' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Find Priests
            </Link>
            <Link 
              href="/services" 
              className={`block hover:text-indigo-600 transition ${
                pathname === '/services' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className={`block hover:text-indigo-600 transition ${
                pathname === '/about' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              About
            </Link>
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <div className="space-y-4">
                <Link
                  href={isPriest ? '/dashboard/priest' : '/dashboard/user'}
                  className="block text-indigo-600 hover:text-indigo-800 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block text-indigo-600 hover:text-indigo-800 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;