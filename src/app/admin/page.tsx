"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Flag,
  AlertTriangle,
  Activity,
  Search,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  BarChart3,
  ShieldAlert,
  Server,
  Database,
  ShieldCheck,
  ArrowRight,
  Plus,
  Trash2,
  Lock,
  Megaphone,
  Briefcase,
  TrendingUp,
  Package,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="space-y-12 max-w-7xl mx-auto w-full">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Admin Control Center</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter">Campus Oversight</h1>
          <p className="text-lg text-muted-foreground font-medium">Manage security, moderation, and system analytics.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-14 rounded-2xl glass px-8 font-black uppercase tracking-widest text-xs border-white/20">
            <Megaphone className="w-4 h-4 mr-2" />
            Broadcast
          </Button>
          <Button className="h-14 rounded-2xl bg-primary text-white px-8 font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/30">
            System Settings
          </Button>
        </div>
      </header>

      <Tabs defaultValue="analytics" onValueChange={setActiveTab} className="w-full">
        <TabsList className="h-16 p-1.5 rounded-[2rem] glass border border-white/40 dark:border-white/10 mb-12">
          <TabsTrigger value="analytics" className="rounded-[1.5rem] px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Analytics</TabsTrigger>
          <TabsTrigger value="moderation" className="rounded-[1.5rem] px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Moderation</TabsTrigger>
          <TabsTrigger value="users" className="rounded-[1.5rem] px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Users</TabsTrigger>
          <TabsTrigger value="matches" className="rounded-[1.5rem] px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Match Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-12">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnalyticsCard
              label="Total Reports"
              value="2,842"
              trend="+14%"
              icon={<Package className="text-primary w-6 h-6" />}
              sub="Across all campuses"
            />
            <AnalyticsCard
              label="Recovery Rate"
              value="64.2%"
              trend="+5.2%"
              icon={<TrendingUp className="text-emerald-500 w-6 h-6" />}
              sub="Industry leading"
            />
            <AnalyticsCard
              label="Active Users"
              value="12.5k"
              trend="+1.2k"
              icon={<Users className="text-blue-500 w-6 h-6" />}
              sub="Verified students"
            />
            <AnalyticsCard
              label="AI Match Success"
              value="89%"
              trend="+22%"
              icon={<Sparkles className="text-amber-500 w-6 h-6" />}
              sub="ViT-B/32 Optimized"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <GlassCard className="lg:col-span-2 p-10 border-white/20 !rounded-[3rem] shadow-3xl">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black tracking-tight">Report Volume Trend</h3>
                <Badge variant="outline" className="glass border-white/20 font-black px-4 py-1.5 rounded-full">LAST 30 DAYS</Badge>
              </div>
              <div className="h-64 w-full flex items-end gap-3 px-4">
                {[45, 60, 35, 90, 70, 85, 100, 65, 55, 75, 95, 80].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 1 }}
                    className="flex-1 bg-gradient-to-t from-primary/80 to-primary/20 rounded-t-lg group relative"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black bg-primary text-white px-2 py-0.5 rounded">
                      {h}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between mt-6 px-4 text-[10px] font-black text-muted-foreground tracking-widest uppercase">
                <span>Mar 01</span>
                <span>Mar 15</span>
                <span>Mar 30</span>
              </div>
            </GlassCard>

            <GlassCard className="p-10 border-white/20 !rounded-[3rem] shadow-3xl space-y-8">
              <h3 className="text-2xl font-black tracking-tight">Top Categories</h3>
              <div className="space-y-6">
                <CategoryRow label="Electronics" value={42} color="bg-primary" />
                <CategoryRow label="Bags & Wallets" value={28} color="bg-emerald-500" />
                <CategoryRow label="Clothing" value={15} color="bg-blue-500" />
                <CategoryRow label="Personal Docs" value={10} color="bg-amber-500" />
                <CategoryRow label="Other" value={5} color="bg-slate-500" />
              </div>
              <div className="pt-6 border-t border-white/10">
                <Button variant="ghost" className="p-0 h-auto text-primary font-black uppercase tracking-widest text-xs">View Full Breakdown</Button>
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-3xl font-black tracking-tight">Post Moderation</h2>
            <div className="flex gap-3">
              <div className="relative w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Filter by user or title..." className="pl-12 h-12 rounded-xl glass border-none font-bold" />
              </div>
              <Button className="h-12 rounded-xl glass px-6 border-white/20 font-bold">Filters</Button>
            </div>
          </div>

          <GlassCard className="overflow-hidden border-white/20 !rounded-[2.5rem] shadow-3xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/10">
                  <th className="px-8 py-6">Reporter</th>
                  <th className="px-8 py-6">Item Details</th>
                  <th className="px-8 py-6">Flags</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <ModerationRow
                  name="Sarah Miller"
                  email="s.miller@uni.edu"
                  title="Lost Blue Jacket"
                  date="2h ago"
                  flags={0}
                />
                <ModerationRow
                  name="James Bond"
                  email="j.bond@uni.edu"
                  title="Gold Rolex Watch"
                  date="5h ago"
                  flags={12}
                  isSpam
                />
                <ModerationRow
                  name="Emma Stone"
                  email="e.stone@uni.edu"
                  title="Hydro Flask - Blue"
                  date="Yesterday"
                  flags={1}
                />
              </tbody>
            </table>
          </GlassCard>
        </TabsContent>

        <TabsContent value="users" className="space-y-8">
          {/* User management content would go here */}
          <div className="h-96 flex flex-col items-center justify-center opacity-30">
            <Users className="w-16 h-16 mb-4" />
            <p className="text-lg font-black uppercase tracking-widest">User Directory Active</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AnalyticsCard({ label, value, trend, icon, sub }: { label: string, value: string, trend: string, icon: React.ReactNode, sub: string }) {
  return (
    <GlassCard hover className="p-8 border-white/20 dark:border-white/5 !rounded-[2.5rem] relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-xs px-3 py-1 rounded-full">
          {trend}
        </Badge>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-black uppercase text-muted-foreground tracking-[0.2em]">{label}</p>
        <h3 className="text-4xl font-black tracking-tighter">{value}</h3>
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest pt-2">{sub}</p>
      </div>
      <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-primary/5 rounded-full blur-3xl" />
    </GlassCard>
  );
}

function CategoryRow({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-black uppercase tracking-widest">
        <span>{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}

function ModerationRow({ name, email, title, date, flags, isSpam }: { name: string, email: string, title: string, date: string, flags: number, isSpam?: boolean }) {
  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-sm font-black shadow-lg">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-black tracking-tight">{name}</p>
            <p className="text-[10px] font-bold text-muted-foreground">{email}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <p className="font-bold tracking-tight">{title}</p>
        <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">{date}</p>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-2">
          {flags > 10 ? (
            <Badge className="bg-destructive/10 text-destructive border-none font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter">
              Severe Flagged ({flags})
            </Badge>
          ) : flags > 0 ? (
            <Badge className="bg-amber-500/10 text-amber-500 border-none font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter">
              Manual Report
            </Badge>
          ) : (
            <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter">
              Verified Safe
            </Badge>
          )}
        </div>
      </td>
      <td className="px-8 py-6 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-emerald-500/10 hover:text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-amber-500/10 hover:text-amber-500">
            <Lock className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-destructive/10 hover:text-destructive">
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
