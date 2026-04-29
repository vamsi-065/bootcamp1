"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithGoogle, refreshSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isSubmitting = useRef(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting.current || isLoading) return;
    
    isSubmitting.current = true;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        isSubmitting.current = false;
        return;
      }

      if (data?.user) {
        await refreshSession();
        toast.success("Logged in successfully! Welcome back.");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-700" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <GlassCard className="p-8 space-y-8 border-white/20 shadow-2xl backdrop-blur-xl bg-white/5">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/20 mb-4 transition-transform hover:rotate-12">
              <Search className="text-white w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">Welcome Back</h1>
            <p className="text-muted-foreground text-sm font-medium">Access your UniLost recovery dashboard</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground">University Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input 
                  name="email"
                  type="email" 
                  placeholder="name@university.edu" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pl-10 h-12 rounded-xl glass border-white/10 focus-visible:ring-primary/50 text-white" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Password</label>
                <Link href="#" className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pl-10 pr-10 h-12 rounded-xl glass border-white/10 focus-visible:ring-primary/50 text-white" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 mt-6 group relative overflow-hidden bg-primary text-white hover:scale-[1.02] transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowLeft className="ml-2 w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-[#0f172a] px-3 text-muted-foreground tracking-widest">Or continue with</span></div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl glass border-white/10 font-black text-xs uppercase tracking-widest text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3"
            onClick={signInWithGoogle}
            disabled={isLoading}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google OAuth
          </Button>

          <p className="text-center text-sm text-muted-foreground pt-2 font-medium">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-primary font-black hover:underline">
              Create one
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
