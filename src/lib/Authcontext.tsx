import { router } from "expo-router";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { checkSession, clearSession, saveSession, UserData } from "./sessionUtils";
import { supabase } from "./supabase";

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string, userData: UserData) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUserProfile: (updatedProfile: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const session = await checkSession();
      
      if (session) {
        setToken(session.token);
        setUser(session.userData);
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (sessionToken: string, userData: UserData) => {
    try {
      await saveSession(sessionToken, userData);
      setToken(sessionToken);
      setUser(userData);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await clearSession();
      setToken(null);
      setUser(null);
      router.replace("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const refreshSession = async () => {
    await checkExistingSession();
  };
  const updateUserProfile = async (updatedProfile: any) => {
    try {
      // Fetch the latest profile from database
      const { data, error } = await supabase
        .from('Costumer_profiles_ORDO')
        .select('*')
        .eq('id', user?.profile?.id)
        .single();

      if (error) throw error;

      if (data && user) {
        const updatedUser = {
          ...user,
          profile: data
        };
        
        // Update state
        setUser(updatedUser);
        
        // Update local storage
        if (token) {
          await saveSession(token, updatedUser);
        }
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    signIn,
    signOut,
    refreshSession,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};