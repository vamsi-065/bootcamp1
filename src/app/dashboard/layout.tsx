"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  PlusCircle, 
  Bell, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Shield,
  Search as SearchIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/context/auth-context";
import { NotificationDrawer } from "@/components/layout/notification-drawer";


const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Search, label: "Search & Match", href: "/search" },
  { icon: PlusCircle, label: "Report Item", href: "/report" },
  { icon: MessageSquare, label: "Messages", href: "/chat" },
  { icon: Shield, label: "Admin Panel", href: "/admin", adminOnly: true },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (!user) return null;

  const initials = user.full_name 
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() || '??';

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-80 p-8 border-r border-border/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-3xl sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-16 px-2">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20">
            <SearchIcon className="text-white w-7 h-7" />
          </div>
          <span className="text-3xl font-black tracking-tighter">UniLost</span>
        </div>

        <nav className="flex-1 space-y-3">
          {navItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-primary text-white shadow-xl shadow-primary/20" 
                    : "text-muted-foreground hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-foreground"
                )}>
                  <item.icon className={cn("w-6 h-6 z-10 transition-transform duration-300", isActive ? "" : "group-hover:scale-110")} />
                  <span className="font-bold z-10">{item.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-100" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-6">
          <button 
            onClick={() => setIsNotifOpen(true)}
            className="w-full flex items-center justify-between p-5 rounded-[1.5rem] bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-white/10 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white dark:border-slate-900" />
              </div>
              <span className="font-bold text-sm">Notifications</span>
            </div>
            <div className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">3 New</div>
          </button>

          <GlassCard className="p-5 border-white/20 dark:border-white/5 !rounded-[2rem]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg">
                {initials}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-base font-black truncate leading-tight">{user.full_name || 'Student'}</p>
                <p className="text-xs text-muted-foreground font-bold tracking-tight uppercase">{user.role} · {user.student_id || 'ID N/A'}</p>
              </div>
            </div>
          </GlassCard>
          
          <Button 
            variant="ghost" 
            onClick={logout}
            className="w-full justify-start gap-4 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-2xl h-14 font-bold"
          >
            <LogOut className="w-6 h-6" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-0 w-full z-50 p-6 flex items-center justify-between glass border-b border-white/20">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <SearchIcon className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter">UniLost</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full relative" onClick={() => setIsNotifOpen(true)}>
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white dark:border-slate-900" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/60 backdrop-blur-2xl pt-28 px-8">
          <nav className="space-y-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                <div className={cn(
                  "flex items-center gap-5 px-8 py-6 rounded-[2rem] text-xl font-black transition-all",
                  pathname === item.href ? "bg-primary text-white shadow-2xl" : "text-muted-foreground bg-white/20"
                )}>
                  <item.icon className="w-8 h-8" />
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-8 lg:p-16 pt-32 lg:pt-16 overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}

