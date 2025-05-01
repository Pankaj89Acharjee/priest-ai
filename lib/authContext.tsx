// lib/authContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { getUserProfile } from './auth';
import { UserProfile } from '@/types/user';
import { PriestProfile } from '@/types/priest';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | PriestProfile | null;
  loading: boolean;
  isPriest: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isPriest: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | PriestProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPriest, setIsPriest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile);
          setIsPriest(userProfile ? 'isPriest' in userProfile && userProfile.isPriest : false);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setProfile(null);
          setIsPriest(false);
        }
      } else {
        setProfile(null);
        setIsPriest(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isPriest }}>
      {children}
    </AuthContext.Provider>
  );
};

// lib/protected.tsx
