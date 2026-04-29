"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { Search, User, Bell, Menu, X, PlusCircle, Zap, LogOut, ChevronDown, Settings, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { NotificationDrawer } from "./notification-drawer";
import { useNotifications } from "@/hooks/use-notifications";
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FloatingNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isLoading: isAuthLoading } = useAuth();

  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { unreadCount } = useNotifications(user?.id ?? null);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  if (isAuthLoading) return null;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
          isScrolled ? "py-2" : "py-4"
        )}
      >
        <GlassCard
          variant="light"
          className={cn(
            "max-w-7xl mx-auto flex items-center justify-between !rounded-full px-6 py-2 border-white/20 dark:border-white/10 shadow-2xl transition-all duration-300",
            isScrolled ? "bg-[#0f172a]/80 scale-95 backdrop-blur-xl" : "bg-white/5 backdrop-blur-md"
          )}
        >
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-300">
              <Search className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              UniLost
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/search" active={pathname === '/search'}>Search</NavLink>
            {user && <NavLink href="/dashboard" active={pathname === '/dashboard'}>Dashboard</NavLink>}
            
            <div className="h-6 w-px bg-white/10 mx-2" />
            
            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  <Zap className="w-4 h-4 fill-current" />
                  <span className="text-[10px] font-black tracking-widest uppercase">750 Credits</span>
                </div>
              )}

              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full relative hover:bg-white/5"
                  onClick={() => setIsNotificationOpen(true)}
                >
                  <Bell className="w-5 h-5 text-white/70" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-[#0f172a]"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </Button>
              )}

              {!user ? (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" className="rounded-full font-black text-xs uppercase tracking-widest text-white/70 hover:text-white">Log in</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="premium" className="rounded-full px-6 font-black text-xs uppercase tracking-widest">Join Now</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-all group">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-white border border-white/20 shadow-lg group-hover:scale-105 transition-transform">
                          <User className="w-5 h-5" />
                        </div>
                        <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 glass border-white/10 bg-[#0f172a]/95 text-white rounded-2xl p-2 shadow-2xl backdrop-blur-xl mt-4">
                      <DropdownMenuLabel className="px-3 py-2">
                        <p className="text-sm font-black truncate">{user.full_name || 'Student Account'}</p>
                        <p className="text-[10px] text-muted-foreground font-bold truncate">{user.email}</p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10 mx-2 my-1" />
                      <DropdownMenuItem className="rounded-xl focus:bg-white/5 cursor-pointer flex items-center gap-2 py-2" onClick={() => router.push('/dashboard')}>
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-bold text-xs">Profile</span>
                      </DropdownMenuItem>
                      {user.role === 'admin' && (
                        <DropdownMenuItem className="rounded-xl focus:bg-white/5 cursor-pointer flex items-center gap-2 py-2" onClick={() => router.push('/admin')}>
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <span className="font-bold text-xs">Admin Panel</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="rounded-xl focus:bg-white/5 cursor-pointer flex items-center gap-2 py-2">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        <span className="font-bold text-xs">Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10 mx-2 my-1" />
                      <DropdownMenuItem 
                        className="rounded-xl focus:bg-destructive/10 text-destructive cursor-pointer flex items-center gap-2 py-2"
                        onClick={logout}
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-black text-xs uppercase tracking-widest">Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              
              <Link href="/report">
                <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 group h-10">
                  <PlusCircle className="mr-2 w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="font-black text-xs uppercase tracking-widest">Report</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
                onClick={() => setIsNotificationOpen(true)}
              >
                <Bell className="w-5 h-5 text-white/70" />
                {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white/70"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </GlassCard>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-24 left-6 right-6 z-50"
            >
              <GlassCard className="p-6 space-y-4 shadow-2xl border-white/20 backdrop-blur-xl bg-[#0f172a]/95">
                <MobileNavLink href="/search" active={pathname === '/search'} onClick={() => setIsMobileMenuOpen(false)}>Search Items</MobileNavLink>
                {user && <MobileNavLink href="/dashboard" active={pathname === '/dashboard'} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>}
                <MobileNavLink href="/report" active={pathname === '/report'} onClick={() => setIsMobileMenuOpen(false)}>Report Item</MobileNavLink>
                
                <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                  {!user ? (
                    <>
                      <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="glass" className="w-full rounded-2xl h-12 font-black uppercase tracking-widest text-xs">Log In</Button>
                      </Link>
                      <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="premium" className="w-full rounded-2xl h-12 font-black uppercase tracking-widest text-xs">Create Account</Button>
                      </Link>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-white border border-white/20 shadow-lg">
                          <User className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-white truncate">{user.full_name || 'Student'}</p>
                          <p className="text-[10px] font-bold text-muted-foreground truncate uppercase">{user.email}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full rounded-2xl h-12 glass border-white/10 text-destructive hover:bg-destructive/10 font-black uppercase tracking-widest text-xs transition-all"
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link href={href} className={cn(
      "text-xs font-black uppercase tracking-widest transition-all relative group",
      active ? "text-primary" : "text-white/60 hover:text-white"
    )}>
      {children}
      <span className={cn(
        "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
        active ? "w-full" : "w-0 group-hover:w-full"
      )} />
    </Link>
  );
}

function MobileNavLink({ href, children, onClick, active }: { href: string; children: React.ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between text-sm font-black uppercase tracking-widest p-4 rounded-2xl transition-all",
        active ? "bg-primary/10 text-primary" : "hover:bg-white/5 text-white/70"
      )}
    >
      {children}
      {active && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
    </Link>
  );
}
