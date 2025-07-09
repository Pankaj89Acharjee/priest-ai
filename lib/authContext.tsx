// lib/authContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { getUserProfile, signOutFx } from './auth';
import { UserProfile } from '@/types/user';
import { PriestProfile } from '@/types/priest';

export type AuthContextType = {
  user: User | null;
  profile: UserProfile | PriestProfile | null;
  loading: boolean;
  isPriest: boolean;
  clearAuth: () => void;
  handleSignOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isPriest: false,
  clearAuth: () => {},
  handleSignOut: async () => {}
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

      console.log("User in authContext is", user)
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
  }, [user]);

  const clearAuth = () => {
    setUser(null);
    setProfile(null)
    setIsPriest(false);
    setLoading(false);
  };


  const handleSignOut = async () => {
    console.log("=== START OF HANDLESIGNOUT ==="); // Debug log
    try {
      console.log("About to call signOutFx"); // Debug log
      await signOutFx();
      console.log("signOutFx completed successfully"); // Debug log
      console.log("About to clear auth state"); // Debug log
      clearAuth();
      console.log("Auth state cleared successfully"); // Debug log
    } catch (error) {
      console.error("Error in handleSignOut:", error); // Debug log
      throw error;
    } finally {
      console.log("=== END OF HANDLESIGNOUT ==="); // Debug log
    }
  }
  return (
    <AuthContext.Provider value={{ user, profile, loading, isPriest, clearAuth, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};


