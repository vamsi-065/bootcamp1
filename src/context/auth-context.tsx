"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface AuthUser {
  id: string;
  email?: string;
  full_name?: string;
  student_id?: string;
  role?: 'student' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching profile:", error.message || error);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      return null;
    }
  }, []);

  const ensureProfile = useCallback(async (supabaseUser: any) => {
    if (!supabaseUser) return null;
    
    try {
      // First try to fetch
      let profile = await fetchProfile(supabaseUser.id);
      
      // If no profile, create one (upsert)
      if (!profile) {
        console.log("Profile missing, creating for user:", supabaseUser.id);
        const { data, error } = await supabase
          .from('profiles')
          .upsert({
            id: supabaseUser.id,
            email: supabaseUser.email,
            full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'New Student',
            student_id: supabaseUser.user_metadata?.student_id || '',
            role: 'student'
          }, { onConflict: 'id' })
          .select()
          .single();
        
        if (error) {
          console.error("Error creating/upserting profile:", error.message || error);
          // If upsert fails (maybe due to RLS), try one more fetch just in case it was created by a trigger
          const retry = await fetchProfile(supabaseUser.id);
          if (retry) return retry;
        } else {
          profile = data;
        }
      }
      return profile;
    } catch (err) {
      console.error("Error in ensureProfile:", err);
      return null;
    }
  }, [fetchProfile]);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profile = await ensureProfile(session.user);
        setUser({
          id: session.user.id,
          email: session.user.email,
          full_name: profile?.full_name || session.user.user_metadata?.full_name,
          student_id: profile?.student_id || session.user.user_metadata?.student_id,
          role: profile?.role || 'student'
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Session refresh error:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [ensureProfile]);

  useEffect(() => {
    refreshSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth State Changed:", event);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          const profile = await ensureProfile(session.user);
          setUser({
            id: session.user.id,
            email: session.user.email,
            full_name: profile?.full_name || session.user.user_metadata?.full_name,
            student_id: profile?.student_id || session.user.user_metadata?.student_id,
            role: profile?.role || 'student'
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        if (typeof window !== 'undefined') {
          window.location.href = "/";
        }
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [refreshSession, ensureProfile, router]);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "OAuth Sign-in failed");
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      
      toast.success("Signed out successfully");
      
      if (typeof window !== 'undefined') {
        window.location.href = "/";
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to sign out");
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      // Delete from profiles (will cascade delete other items)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // Sign out
      await supabase.auth.signOut();
      setUser(null);
      
      toast.success("Account deleted successfully");
      if (typeof window !== 'undefined') {
        window.location.href = "/";
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account");
      console.error("Delete account error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, deleteAccount, signInWithGoogle, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
