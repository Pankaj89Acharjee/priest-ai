// components/ui/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { motion } from 'framer-motion';
import { FloatingDock } from './floating-dock';
import {
  IconHome,
  IconDashboard,
  IconUser,
  IconLogout,
  IconLogin,
  IconUserPlus
} from '@tabler/icons-react';

const Navbar = () => {
  const { user, isPriest } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    router.push('/auth/logout');
  };

  const navItems = user ? [
    {
      title: 'Home',
      icon: <IconHome className="w-full h-full" />,
      href: '/'
    },
    {
      title: 'Dashboard',
      icon: <IconDashboard className="w-full h-full" />,
      href: isPriest ? '/dashboard/priest' : `/dashboard/${user.uid}`
    },
    {
      title: 'Profile',
      icon: <IconUser className="w-full h-full" />,
      href: '/profile'
    },
    {
      title: 'Logout',
      icon: <IconLogout className="w-full h-full" />,
      href: '#',
      onClick: handleLogout
    }
  ] : [
    {
      title: 'Home',
      icon: <IconHome className="w-full h-full" />,
      href: '/'
    },
    {
      title: 'Login',
      icon: <IconLogin className="w-full h-full" />,
      href: '/auth/login'
    },
    {
      title: 'Register',
      icon: <IconUserPlus className="w-full h-full" />,
      href: '/auth/register'
    }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                Priest
              </span>
            </Link>
          </div>
        </div>
      </motion.nav>

      <FloatingDock
        items={navItems}
        desktopClassName="fixed bottom-8 left-1/2 -translate-x-1/2"
        mobileClassName="fixed bottom-8 right-8"
      />
    </>
  );
};

export default Navbar;