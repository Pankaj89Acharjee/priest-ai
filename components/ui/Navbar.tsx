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
  const { user, isPriest, clearAuth, handleSignOut } = useAuth();
  console.log("Navbar rendered, user:", user); // Debug log for component render
  
 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    console.log("=== START OF HANDLELOGOUT ==="); // Debug log
    try {
      console.log("About to call handleSignOut"); // Debug log
      await handleSignOut();
      console.log("handleSignOut completed successfully"); // Debug log
      console.log("About to redirect to home"); // Debug log
      router.push('/');
      console.log("Redirect completed"); // Debug log
    } catch (error) {
      console.error("Error in handleLogout:", error); // Debug log
    } finally {
      console.log("=== END OF HANDLELOGOUT ==="); // Debug log
    }
  };

  // if(user) {
  //   handleLogout()
  // }

  const handleLogin = () => {
    router.push('/auth/login')
  }


  const navItems = user ? [
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
      link: '/',
      href: '/',
      onClick: () => {
        console.log("Logout button clicked in navItems"); // Debug log
        try {
          handleLogout();
        } catch (error) {
          console.error("Error calling handleLogout:", error); // Debug log
        }
      }
    }
  ] : [
    {
      name: 'Pricing',
      title: 'Pricing',
      icon: <IconLogin className="w-full h-full" />,
      link: '/standardPricing',
      href: '/standardPricing'
    },
    {
      name: 'Best Priests',
      title: 'Best Priests',
      icon: <IconLogin className="w-full h-full" />,
      link: '/bestPriests',
      href: '/bestPriests'
    },
    {
      name: 'Occassion List',
      title: 'Occassion List',
      icon: <IconLogin className="w-full h-full" />,
      link: '/occassions',
      href: '/occassions'
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
            <NavbarButton variant="secondary" onClick={handleLogin}>Login</NavbarButton>
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
                onClick={handleLogin}
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

      {/* <FloatingDock
        items={navItems}
        desktopClassName="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-500 dark:bg-gray-200"
        mobileClassName="fixed bottom-8 right-8"
      /> */}
    </>
  );
};

export default NavbarMain;