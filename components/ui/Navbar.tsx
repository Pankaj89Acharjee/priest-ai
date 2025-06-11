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

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

const NavbarMain = () => {
  const { user, isPriest } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();

  const handleLogout = () => {
    router.push('/auth/logout');
  };

  const navItems = user ? [
    {
      name: 'Home',
      title: 'Home',
      icon: <IconHome className="w-full h-full" />,
      link: '/',
      href: '/'
    },
    {
      name: 'Dashboard',
      title: 'Dashboard',
      icon: <IconDashboard className="w-full h-full" />,
      link: isPriest ? '/dashboard/priest' : `/dashboard/${user.uid}`,
      href: isPriest ? '/dashboard/priest' : `/dashboard/${user.uid}`
    },
    {
      name: 'Profile',
      title: 'Profile',
      icon: <IconUser className="w-full h-full" />,
      link: '/profile',
      href: '/profile'
    },
    {
      name: 'Logout',
      title: 'Logout',
      icon: <IconLogout className="w-full h-full" />,
      link: '#',
      href: '#',
      onClick: handleLogout
    }
  ] : [
    {
      name: 'Home',
      title: 'Home',
      icon: <IconHome className="w-full h-full" />,
      link: '/',
      href: '/'
    },
    {
      name: 'Login',
      title: 'Login',
      icon: <IconLogin className="w-full h-full" />,
      link: '/auth/login',
      href: '/auth/login'
    },
    {
      name: 'Register',
      title: 'Register',
      icon: <IconUserPlus className="w-full h-full" />,
      link: '/auth/register',
      href: '/auth/register'
    }
  ];

  return (
    <>
      <Navbar className="rounded-none mt-3">
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">Login</NavbarButton>
            <NavbarButton variant="primary">Book a call</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <FloatingDock
        items={navItems}
        desktopClassName="fixed bottom-8 left-1/2 -translate-x-1/2"
        mobileClassName="fixed bottom-8 right-8"
      />
    </>
  );
};

export default NavbarMain;