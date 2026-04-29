"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  Filter as FilterIcon,
  Search,
  MapPin,
  MoreVertical,
  Edit3,
  Trash2,
  CheckCircle,
  Bell,
  X,
  Loader2,
  LayoutDashboard,
  Search as SearchIcon,
  History,
  Settings,
  ShieldCheck,
  Zap,
  MessageSquare,
  Info,
  Calendar,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSavingAlert, setIsSavingAlert] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    location: ""
  });

  // Mock data for demonstration (replace with real fetches in production)
  const [recentReports, setRecentReports] = useState([
    { id: 1, title: "MacBook Air M2 - Space Gray", location: "Library Floor 2", date: "2 hours ago", status: "lost", category: "Electronics", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300" },
    { id: 2, title: "iPhone 14 Pro Max", location: "Student Center", date: "5 hours ago", status: "found", category: "Electronics", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=300" },
    { id: 3, title: "Blue Hydro Flask", location: "Sports Complex", date: "8 hours ago", status: "lost", category: "Other", image: "https://images.unsplash.com/photo-1602143399827-bd95ef6f429c?w=300" },
  ]);

  const [myReports, setMyReports] = useState([]); // Empty state demo
  const [smartMatches, setSmartMatches] = useState([
    { id: 101, title: "Beats Headphones", match: 96, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300" }
  ]);

  const [alertForm, setAlertForm] = useState({
    keyword: "",
    category: "Electronics",
    type: "all"
  });

  const { user, isLoading: isAuthLoading, deleteAccount } = useAuth();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast.error("Please log in to access the dashboard.");
      router.push("/auth/login?returnTo=/dashboard");
    } else if (!isAuthLoading && user) {
      // Simulate data loading
      const timer = setTimeout(() => setIsLoadingData(false), 800);
      return () => clearTimeout(timer);
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing your secure session...</p>
      </div>
    );
  }

  const handleSaveAlert = async () => {
    if (!alertForm.keyword && alertForm.category === "all") {
      toast.error("Please provide at least a keyword or category.");
      return;
    }

    setIsSavingAlert(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("user_alerts").insert({
        user_id: user.id,
        keyword: alertForm.keyword,
        category: alertForm.category,
        item_type: alertForm.type
      });

      if (error) throw error;

      toast.success("Alert preferences saved successfully!");
      setIsAlertModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save alert.");
    } finally {
      setIsSavingAlert(false);
    }
  };

  const openDetails = (item: any) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const ComingSoon = (feature: string) => {
    toast.info(`${feature} feature coming soon!`);
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full relative">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDEBAR: Navigation */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-4 mb-4">Main Menu</h3>
            <SidebarLink icon={<LayoutDashboard className="w-5 h-5" />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <SidebarLink icon={<SearchIcon className="w-5 h-5" />} label="Search All" onClick={() => router.push('/search')} />
            <SidebarLink icon={<History className="w-5 h-5" />} label="My Reports" active={activeTab === 'my-items'} onClick={() => setActiveTab('my-items')} />
            <SidebarLink icon={<Zap className="w-5 h-5" />} label="Matches" active={activeTab === 'matches'} onClick={() => setActiveTab('matches')} />
            <SidebarLink icon={<MessageSquare className="w-5 h-5" />} label="Messages" onClick={() => ComingSoon('Messages')} />
          </div>

          <div className="space-y-2 pt-4 border-t border-white/5">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-4 mb-4">Account</h3>
            <SidebarLink icon={<Settings className="w-5 h-5" />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            <SidebarLink icon={<ShieldCheck className="w-5 h-5" />} label="Security" onClick={() => ComingSoon('Security')} />
          </div>

          <GlassCard className="p-6 bg-primary/5 border-primary/20 !rounded-3xl mt-8">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                 <Zap className="w-5 h-5 fill-current" />
               </div>
               <div>
                 <p className="text-xs font-black text-white">Pro Plan</p>
                 <p className="text-[10px] font-bold text-muted-foreground">AI Vision Enabled</p>
               </div>
             </div>
             <Button 
               onClick={() => setIsUpgradeModalOpen(true)}
               className="w-full h-10 rounded-xl bg-primary text-white text-xs font-bold hover:scale-105 transition-transform"
             >
               Upgrade Now
             </Button>
          </GlassCard>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 space-y-8">
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-white capitalize">
                {activeTab === 'overview' ? 'Dashboard' : activeTab === 'my-items' ? 'My Reports' : activeTab}
              </h1>
              <p className="text-sm text-muted-foreground font-medium">Manage your campus activities and recovery status.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn("rounded-xl glass h-12 px-5 border-white/10 font-bold", isFilterOpen && "bg-primary text-white")}
              >
                <FilterIcon className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button 
                onClick={() => router.push("/report")}
                className="rounded-xl h-12 px-6 bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon={<Package className="text-primary w-4 h-4" />} label="Active" value="124" trend="+12%" />
            <StatsCard icon={<Clock className="text-amber-500 w-4 h-4" />} label="Lost" value="86" trend="+5%" />
            <StatsCard icon={<CheckCircle2 className="text-emerald-500 w-4 h-4" />} label="Found" value="38" trend="+18%" />
            <StatsCard icon={<TrendingUp className="text-primary w-4 h-4" />} label="Matches" value="42%" trend="+2.4%" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Center Content Area */}
            <div className="lg:col-span-2 space-y-6 min-w-0">
               
               {/* OVERVIEW TAB */}
               {activeTab === 'overview' && (
                 <div className="space-y-6">
                   <div className="flex items-center justify-between px-1">
                     <h2 className="text-xl font-black tracking-tight text-white">Recent Campus Reports</h2>
                     <Button variant="ghost" className="text-xs font-bold text-primary p-0 h-auto hover:bg-transparent" onClick={() => router.push('/search')}>View All</Button>
                   </div>
                   
                   {isLoadingData ? (
                     <div className="flex items-center justify-center h-48"><Loader2 className="w-8 h-8 animate-spin text-primary/50" /></div>
                   ) : (
                     <div className="space-y-3">
                       {recentReports.map(item => (
                         <ItemRow key={item.id} {...(item as any)} onClick={() => openDetails(item)} />
                       ))}
                     </div>
                   )}
                 </div>
               )}

               {/* MY ITEMS TAB */}
               {activeTab === 'my-items' && (
                 <div className="space-y-6">
                   <div className="flex items-center justify-between px-1">
                     <h2 className="text-xl font-black tracking-tight text-white">Your Reported Items</h2>
                     <Badge className="bg-primary/10 text-primary border-none">0 items</Badge>
                   </div>
                   
                   <EmptyState 
                     icon={<Package className="w-12 h-12" />} 
                     title="No reports yet" 
                     description="You haven't reported any lost or found items." 
                     actionLabel="Create Report"
                     onAction={() => router.push('/report')}
                   />
                 </div>
               )}

               {/* MATCHES TAB */}
               {activeTab === 'matches' && (
                 <div className="space-y-6">
                   <div className="flex items-center justify-between px-1">
                     <h2 className="text-xl font-black tracking-tight text-white">AI Potential Matches</h2>
                     <Badge className="bg-emerald-500/10 text-emerald-500 border-none">1 Highly Likely</Badge>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {smartMatches.map(match => (
                       <GlassCard key={match.id} className="p-4 border-primary/20 !rounded-3xl bg-primary/[0.03]">
                         <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-white/5 shadow-xl relative group">
                           <img src={match.image} alt={match.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           <div className="absolute top-3 right-3 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg">{match.match}% Match</div>
                         </div>
                         <h4 className="font-black text-lg text-white mb-1">{match.title}</h4>
                         <p className="text-xs text-muted-foreground mb-4">Detected via CLIP vision matching.</p>
                         <div className="flex gap-2">
                           <Button onClick={() => openDetails(match)} className="flex-1 bg-primary text-white text-xs font-bold h-10 rounded-xl">Details</Button>
                           <Button variant="ghost" className="text-xs font-bold text-muted-foreground h-10 px-4" onClick={() => ComingSoon('Dismiss')}>Dismiss</Button>
                         </div>
                       </GlassCard>
                     ))}
                   </div>
                 </div>
               )}

               {/* SETTINGS TAB */}
               {activeTab === 'settings' && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="px-1">
                     <h2 className="text-2xl font-black tracking-tight text-white">Account Settings</h2>
                     <p className="text-sm text-muted-foreground">Manage your profile preferences and account security.</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <GlassCard className="p-6 border-white/10 !rounded-3xl space-y-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shrink-0">
                            {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-black text-lg text-white truncate">{user?.full_name || 'Student Account'}</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider truncate overflow-hidden text-ellipsis">{user?.email}</p>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-white/5 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-muted-foreground">Student ID</span>
                            <span className="text-xs font-black text-white">{user?.student_id || 'Not set'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-muted-foreground">Account Role</span>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase">{user?.role}</Badge>
                          </div>
                        </div>
                     </GlassCard>

                     <GlassCard className="p-6 border-white/10 !rounded-3xl space-y-4">
                        <h3 className="font-black text-white">Preferences</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                              <Bell className="w-4 h-4 text-primary" />
                              <span className="text-xs font-bold">Email Notifications</span>
                            </div>
                            <div className="w-10 h-5 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-lg" /></div>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                              <span className="text-xs font-bold">Public Profile</span>
                            </div>
                            <div className="w-10 h-5 bg-white/10 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white/40 rounded-full" /></div>
                          </div>
                        </div>
                     </GlassCard>
                   </div>

                   <div className="pt-8 border-t border-white/5">
                     <GlassCard className="p-8 border-destructive/20 bg-destructive/[0.02] !rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2">
                          <h3 className="text-xl font-black text-destructive">Danger Zone</h3>
                          <p className="text-sm text-muted-foreground max-w-md break-words">Deleting your account is permanent. All your reported items, matches, and history will be lost forever.</p>
                        </div>
                        <Button 
                          variant="destructive" 
                          className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl shadow-destructive/20"
                          onClick={() => setIsDeleteConfirmOpen(true)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                     </GlassCard>
                   </div>
                 </div>
               )}
            </div>

            {/* RIGHT SIDEBAR: Widgets */}
            <div className="space-y-6">
              {/* Premium Widget */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-muted-foreground px-1 uppercase tracking-widest">Pro Experience</h3>
                <GlassCard className="p-6 border-none bg-gradient-to-br from-primary/20 via-blue-600/10 to-transparent !rounded-3xl relative overflow-hidden group">
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Zap className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <p className="font-black text-white text-lg">Pro Plan</p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">Unlimited Matching</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setIsUpgradeModalOpen(true)}
                      variant="glass"
                      className="w-full h-11 rounded-2xl text-xs font-black uppercase tracking-widest"
                    >
                      Upgrade Now
                    </Button>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                </GlassCard>
              </div>

              {/* Smart Match Widget */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest">AI Matches</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('matches')} className="h-6 text-[10px] font-black uppercase text-primary hover:text-primary hover:bg-primary/10 px-2 rounded-lg">
                    View All
                  </Button>
                </div>
                <GlassCard className="p-5 border-primary/20 !rounded-3xl shadow-xl bg-primary/[0.02]">
                  <div className="flex gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shrink-0 border border-white/10">
                      <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200" alt="Item" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-base text-white truncate leading-tight">Beats Headphones</p>
                      <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black px-2 mt-1">96% AI MATCH</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setActiveTab('matches')} variant="glass" className="flex-1 h-10 rounded-xl text-xs font-black uppercase tracking-widest">Details</Button>
                    <Button onClick={() => toast.success("Match verified!")} variant="outline" className="h-10 w-10 rounded-xl border-white/10 p-0 hover:bg-emerald-500/20 hover:text-emerald-500 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </GlassCard>
              </div>

              {/* Alerts Widget */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-muted-foreground px-1 uppercase tracking-widest">Stay Updated</h3>
                <GlassCard className="p-5 border-white/10 !rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">Active Alerts</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">04 Enabled</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsAlertModalOpen(true)} className="h-8 w-8 rounded-lg hover:bg-white/5">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <ActivityItem icon={<TrendingUp className="w-3 h-3" />} label="New matches found" value="12" />
                    <ActivityItem icon={<Clock className="w-3 h-3" />} label="Recent reports" value="28" />
                  </div>

                  <Button 
                    variant="glass"
                    className="w-full rounded-xl h-10 text-[10px] font-black uppercase tracking-widest"
                    onClick={() => setIsAlertModalOpen(true)}
                  >
                    Set New Alert
                  </Button>
                </GlassCard>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {/* ALERT MODAL */}
        {isAlertModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-lg">
              <GlassCard className="p-8 border-primary/30 shadow-3xl !rounded-[2.5rem]">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black tracking-tight">Set Alert Preferences</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsAlertModalOpen(false)} className="rounded-full hover:bg-white/5"><X className="w-5 h-5" /></Button>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Keyword</label>
                    <Input placeholder="e.g. 'Blue iPhone'..." className="h-12 rounded-xl glass border-white/10 px-4 font-bold" value={alertForm.keyword} onChange={(e) => setAlertForm({ ...alertForm, keyword: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                      <select value={alertForm.category} onChange={(e) => setAlertForm({ ...alertForm, category: e.target.value })} className="w-full h-12 rounded-xl glass border-white/10 px-4 font-bold appearance-none bg-slate-900 focus:outline-none">
                        <option>Electronics</option><option>Clothing</option><option>Bags</option><option>Keys</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Type</label>
                      <select value={alertForm.type} onChange={(e) => setAlertForm({ ...alertForm, type: e.target.value })} className="w-full h-12 rounded-xl glass border-white/10 px-4 font-bold appearance-none bg-slate-900 focus:outline-none">
                        <option value="all">All</option><option value="lost">Lost</option><option value="found">Found</option>
                      </select>
                    </div>
                  </div>
                  <Button className="w-full h-12 rounded-xl bg-primary text-white font-bold hover:scale-102 transition-transform" onClick={handleSaveAlert} disabled={isSavingAlert}>{isSavingAlert ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Alert"}</Button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}

        {/* DETAIL MODAL */}
        {isDetailModalOpen && selectedItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full max-w-4xl overflow-hidden">
              <GlassCard className="border-white/10 shadow-3xl !rounded-[3rem] p-0 flex flex-col md:flex-row max-h-[90vh]">
                <div className="w-full md:w-1/2 relative bg-slate-900">
                  <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
                  <Button variant="ghost" size="icon" onClick={() => setIsDetailModalOpen(false)} className="absolute top-6 left-6 rounded-full bg-black/40 text-white hover:bg-black/60"><X className="w-5 h-5" /></Button>
                  <div className="absolute bottom-6 left-6">
                    <Badge className="bg-primary text-white border-none px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                      {selectedItem.status} Item
                    </Badge>
                  </div>
                </div>
                <div className="w-full md:w-1/2 p-10 flex flex-col overflow-y-auto">
                  <div className="space-y-6 flex-1">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">{selectedItem.category}</p>
                      <h2 className="text-3xl font-black tracking-tight text-white">{selectedItem.title}</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <InfoCard icon={<MapPin className="w-4 h-4" />} label="Last Seen" value={selectedItem.location} />
                      <InfoCard icon={<Calendar className="w-4 h-4" />} label="Date Reported" value={selectedItem.date} />
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        High-quality {selectedItem.title.toLowerCase()} found in the {selectedItem.location}. The item appears to be in excellent condition. If this belongs to you, please provide a description of any unique identifiers during the recovery process.
                      </p>
                    </div>
                  </div>

                  <div className="pt-8 mt-8 border-t border-white/5 space-y-4">
                    <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-2xl shadow-primary/30 group">
                      Initiate Recovery <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 h-12 rounded-xl glass border-white/10 font-bold" onClick={() => ComingSoon('Save Item')}>Save for Later</Button>
                      <Button variant="outline" className="flex-1 h-12 rounded-xl glass border-white/10 font-bold" onClick={() => ComingSoon('Report Issue')}>Report Error</Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}

        {/* UPGRADE MODAL */}
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-primary/10 backdrop-blur-2xl">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-xl text-center">
              <GlassCard className="p-12 border-primary/30 shadow-3xl !rounded-[3rem] space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -ml-10 -mb-10" />
                
                <div className="w-20 h-20 bg-primary rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-primary/40 relative">
                  <Zap className="text-white w-10 h-10 fill-current" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-4xl font-black tracking-tight text-white">Go Pro</h2>
                  <p className="text-muted-foreground font-medium">Unlock full-scale AI vision matching and instant recovery tools.</p>
                </div>

                <div className="space-y-4 text-left bg-white/5 p-6 rounded-3xl border border-white/10">
                   <ProFeature label="Unlimited AI Image Matching" />
                   <ProFeature label="Real-time SMS & Push Alerts" />
                   <ProFeature label="Verified Student Identity Badge" />
                   <ProFeature label="Direct Messaging with Recovery Support" />
                </div>

                <div className="space-y-4">
                  <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black text-xl shadow-2xl shadow-primary/30" onClick={() => ComingSoon('Stripe Integration')}>
                    Upgrade for $4.99/mo
                  </Button>
                  <Button variant="ghost" className="text-muted-foreground font-bold" onClick={() => setIsUpgradeModalOpen(false)}>Maybe Later</Button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FILTER OVERLAY */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-20 right-0 z-50 w-full md:w-80">
            <GlassCard className="p-6 border-white/10 shadow-3xl !rounded-3xl space-y-6">
               <div className="flex items-center justify-between">
                 <h3 className="font-black text-sm uppercase tracking-widest">Filters</h3>
                 <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)} className="h-8 w-8"><X className="w-4 h-4" /></Button>
               </div>
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-muted-foreground uppercase">Category</label>
                   <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-full h-10 rounded-lg glass border-white/10 px-3 font-bold text-xs bg-slate-900 focus:outline-none">
                     <option value="all">All Categories</option><option>Electronics</option><option>Bags</option>
                   </select>
                 </div>
                 <Button className="w-full h-10 rounded-lg bg-primary text-white text-xs font-bold" onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
               </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="w-full max-w-md"
            >
              <GlassCard className="p-8 border-destructive/30 shadow-3xl !rounded-[2.5rem] space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mx-auto">
                  <Trash2 className="w-8 h-8" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black tracking-tight text-white">Are you absolutely sure?</h2>
                  <p className="text-sm text-muted-foreground">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button 
                    variant="destructive" 
                    className="h-12 rounded-xl font-black uppercase tracking-widest text-xs"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                    Yes, Delete My Account
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="h-12 rounded-xl font-bold text-muted-foreground"
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm",
        active ? "bg-primary/10 text-primary shadow-inner" : "text-muted-foreground hover:text-white hover:bg-white/5"
      )}
    >
      <span className={cn("transition-colors", active ? "text-primary" : "text-muted-foreground")}>{icon}</span>
      {label}
    </button>
  );
}

function StatsCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) {
  return (
    <GlassCard hover className="p-5 border-white/5 !rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent">
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{trend}</span>
      </div>
      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{label}</p>
      <h3 className="text-2xl font-black tracking-tight text-white mt-1">{value}</h3>
    </GlassCard>
  );
}

function ItemRow({ title, location, date, status, image, onClick }: { title: string, location: string, date: string, status: 'lost' | 'found', image: string, onClick?: () => void }) {
  return (
    <GlassCard hover className="p-4 border-white/5 !rounded-2xl group cursor-pointer transition-all duration-300" onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/5 shadow-lg">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-black text-sm text-white truncate leading-tight">{title}</h4>
            <Badge variant={status === 'lost' ? "destructive" : "secondary"} className="text-[8px] uppercase font-black px-1.5 py-0 rounded-md glass shrink-0">{status}</Badge>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground font-bold text-[10px]">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> {location}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary" /> {date}</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </GlassCard>
  );
}

function ActivityItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between text-[11px] font-bold">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <span className="text-white">{value}</span>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function ProFeature({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm font-bold text-white/80">
      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
        <CheckCircle className="w-3 h-3" />
      </div>
      {label}
    </div>
  );
}

function EmptyState({ icon, title, description, actionLabel, onAction }: { icon: React.ReactNode, title: string, description: string, actionLabel?: string, onAction?: () => void }) {
  return (
    <GlassCard className="p-12 border-dashed border-white/10 !rounded-[2.5rem] bg-transparent flex flex-col items-center text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground/30">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-black text-white">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      </div>
      {actionLabel && (
        <Button onClick={onAction} variant="outline" className="rounded-xl glass border-white/10 font-bold px-6">
          {actionLabel}
        </Button>
      )}
    </GlassCard>
  );
}
