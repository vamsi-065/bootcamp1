"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search as SearchIcon, 
  SlidersHorizontal, 
  MapPin, 
  Calendar, 
  Grid, 
  List,
  Filter,
  ArrowUpRight,
  Clock,
  ChevronRight,
  Sparkles,
  X,
  Loader2,
  Activity,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isSavingAlert, setIsSavingAlert] = useState(false);

  const [alertForm, setAlertForm] = useState({
    keyword: "",
    category: "Electronics",
    type: "all"
  });

  const [activeFilters, setActiveFilters] = useState({
    category: "All Categories",
    location: "",
    date: ""
  });

  const mockItems = [
    { id: 1, title: "iPhone 13", location: "Cafeteria", date: "Mar 24", status: "found", category: "Electronics", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=300&fit=crop", confidence: 96 },
    { id: 2, title: "Scientific Calculator", location: "Engineering Lab", date: "Mar 23", status: "lost", category: "Electronics", image: "https://images.unsplash.com/photo-1574607383476-f517f260d30b?w=400&h=300&fit=crop", confidence: 84 },
    { id: 3, title: "Blue Backpack", location: "Gym", date: "Mar 22", status: "found", category: "Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop", confidence: 72 },
    { id: 4, title: "Water Bottle (Hydro Flask)", location: "Science Quad", date: "Mar 22", status: "lost", category: "Other", image: "https://images.unsplash.com/photo-1602143399827-bd95ef6f429c?w=400&h=300&fit=crop" },
    { id: 5, title: "House Keys (Red Keychain)", location: "Library", date: "Mar 21", status: "found", category: "Keys", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=300&fit=crop", confidence: 91 },
    { id: 6, title: "Sony WH-1000XM4", location: "Bus Terminal", date: "Mar 20", status: "lost", category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" },
  ];

  const recentActivity = [
    { id: 1, type: 'match', msg: 'New match for "Blue Backpack"', time: '2m ago' },
    { id: 2, type: 'report', msg: 'Someone found "Keys" at Library', time: '15m ago' },
    { id: 3, type: 'report', msg: 'Lost "Glasses" at Cafeteria', time: '1h ago' },
  ];

  const { user, isLoading: isAuthLoading } = useAuth();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast.error("Please log in to browse items.");
      router.push("/auth/login?returnTo=/search");
    } else if (user) {
      setIsAuthChecking(false);
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    if (isAuthChecking) return;
    setResults(mockItems);
  }, [isAuthChecking]);

  if (isAuthChecking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Verifying Session...</p>
      </div>
    );
  }

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      let filtered = mockItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (activeTab === 'all' || item.status === activeTab)
      );

      if (activeFilters.category !== "All Categories") {
        filtered = filtered.filter(item => item.category === activeFilters.category);
      }
      
      setResults(filtered);
      setIsLoading(false);
    }, 600);
  };

  const loadMore = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setResults(prev => [...prev, ...mockItems.map(i => ({ ...i, id: Math.random() }))]);
      setPage(p => p + 1);
      setIsLoading(false);
    }, 1000);
  };

  const handleSaveAlert = async () => {
    if (!alertForm.keyword && alertForm.category === "All Categories") {
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

  return (
    <div className="flex flex-col lg:flex-row gap-12 relative">
      <AnimatePresence>
        {isAlertModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg"
            >
              <GlassCard className="p-10 border-primary/30 shadow-[0_0_50px_rgba(59,130,246,0.2)] !rounded-[3rem]">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">Set Alerts</h2>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsAlertModalOpen(false)} className="rounded-full">
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Keyword</label>
                    <Input 
                      placeholder="e.g. 'Blue iPhone'..." 
                      className="h-14 rounded-2xl glass border-none px-6 font-bold text-lg text-white"
                      value={alertForm.keyword}
                      onChange={(e) => setAlertForm({ ...alertForm, keyword: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                      <select 
                        value={alertForm.category}
                        onChange={(e) => setAlertForm({ ...alertForm, category: e.target.value })}
                        className="w-full h-14 rounded-2xl glass border-none px-6 font-bold appearance-none cursor-pointer bg-slate-900 text-white"
                      >
                        <option>Electronics</option>
                        <option>Clothing</option>
                        <option>Bags</option>
                        <option>Keys</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Type</label>
                      <select 
                        value={alertForm.type}
                        onChange={(e) => setAlertForm({ ...alertForm, type: e.target.value })}
                        className="w-full h-14 rounded-2xl glass border-none px-6 font-bold appearance-none cursor-pointer bg-slate-900 text-white"
                      >
                        <option value="all">All</option>
                        <option value="lost">Lost</option>
                        <option value="found">Found</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 h-14 rounded-2xl glass font-bold text-lg"
                      onClick={() => setIsAlertModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/30"
                      onClick={handleSaveAlert}
                      disabled={isSavingAlert}
                    >
                      {isSavingAlert ? <Loader2 className="w-6 h-6 animate-spin" /> : "Save Alert"}
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 space-y-12">
        <header className="flex flex-col space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Search & Match</h1>
          <p className="text-lg text-muted-foreground font-medium">Browse campus reports or find what you've lost.</p>
        </header>

        <div className="space-y-6">
          <GlassCard className="p-4 border-white/20 !rounded-[2rem] shadow-2xl">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by keywords (e.g. 'black wallet', 'keys')..." 
                  className="pl-12 h-14 rounded-2xl glass border-none focus-visible:ring-primary/30 text-lg font-medium text-white"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  type="button"
                  variant={isFilterOpen ? "default" : "outline"}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={cn(
                    "h-14 rounded-2xl glass px-6 gap-3 border-white/40 dark:border-white/10 font-bold transition-all",
                    isFilterOpen ? "bg-primary text-white" : ""
                  )}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filters</span>
                </Button>
                <div className="h-14 w-px bg-border/50 mx-2 hidden lg:block" />
                <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setTimeout(() => handleSearch(), 0); }} className="w-full lg:w-auto">
                  <TabsList className="h-14 rounded-2xl p-1.5 glass border border-white/40 dark:border-white/10">
                    <TabsTrigger value="all" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">All</TabsTrigger>
                    <TabsTrigger value="lost" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Lost</TabsTrigger>
                    <TabsTrigger value="found" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Found</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </form>
          </GlassCard>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <GlassCard className="p-8 border-white/20 !rounded-[2rem] grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                    <select 
                      value={activeFilters.category}
                      onChange={(e) => setActiveFilters({ ...activeFilters, category: e.target.value })}
                      className="w-full h-12 rounded-xl glass border-none px-4 font-bold appearance-none cursor-pointer bg-slate-900 text-white"
                    >
                      <option>All Categories</option>
                      <option>Electronics</option>
                      <option>Clothing</option>
                      <option>Bags</option>
                      <option>Keys</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <Input 
                        placeholder="Select area..." 
                        className="pl-10 h-12 rounded-xl glass border-none font-bold text-white" 
                        value={activeFilters.location}
                        onChange={(e) => setActiveFilters({ ...activeFilters, location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Date Range</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <Input 
                        type="date" 
                        className="pl-10 h-12 rounded-xl glass border-none font-bold text-white" 
                        value={activeFilters.date}
                        onChange={(e) => setActiveFilters({ ...activeFilters, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3 flex justify-end gap-3 pt-4 border-t border-white/10">
                    <Button variant="ghost" className="rounded-xl font-bold" onClick={() => {
                      setActiveFilters({ category: "All Categories", location: "", date: "" });
                      setIsFilterOpen(false);
                      setTimeout(() => handleSearch(), 0);
                    }}>Clear</Button>
                    <Button className="rounded-xl font-bold bg-primary text-white px-8" onClick={() => {
                      handleSearch();
                      setIsFilterOpen(false);
                    }}>Apply Filters</Button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {searchQuery.length > 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                 <Sparkles className="w-5 h-5 text-primary" />
               </div>
               <h3 className="text-xl font-black tracking-tight text-white">AI Top Matches</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <GlassCard className="p-4 border-primary/30 bg-primary/5 !rounded-[2.5rem] relative group overflow-hidden">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
                      <img src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=200" alt="Item" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                         <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black uppercase px-2 py-0.5 rounded-full">98% Similarity</Badge>
                      </div>
                      <h4 className="text-lg font-black tracking-tight text-white">Found: iPhone 13</h4>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Library · 2h ago</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />
               </GlassCard>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-muted-foreground tracking-tight">
            Showing <span className="text-white">{results.length} reports</span> on campus
          </p>
          <div className="flex items-center gap-1 glass p-1.5 rounded-2xl border border-white/40 dark:border-white/10">
            <Button 
              variant={viewMode === "grid" ? "outline" : "ghost"} 
              size="icon" 
              className="rounded-xl h-10 w-10 p-0"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-5 h-5" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "outline" : "ghost"} 
              size="icon" 
              className="rounded-xl h-10 w-10 p-0"
              onClick={() => setViewMode("list")}
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className={cn(
          "grid gap-10",
          viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
        )}>
          {results.length > 0 ? results.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
            >
              {viewMode === "grid" ? (
                <GlassCard 
                  hover
                  className="p-0 overflow-hidden group border-white/20 dark:border-white/5 !rounded-[2.5rem] h-full flex flex-col shadow-xl"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <Badge variant={item.status === 'lost' ? "destructive" : "secondary"} className="glass shadow-2xl border-none px-4 py-1 font-black text-[10px] tracking-widest uppercase">
                        {item.status}
                      </Badge>
                      {item.status === 'found' && (
                        <Badge className="bg-amber-500/80 text-white border-none px-3 py-1 font-black text-[10px] tracking-widest uppercase flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          28 Days Left
                        </Badge>
                      )}
                    </div>
                    {item.confidence && (
                       <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/20">
                          <div className="flex justify-between px-3 py-1">
                             <span className="text-[10px] font-black uppercase text-white">AI Confidence</span>
                             <span className="text-[10px] font-black text-primary">{item.confidence}%</span>
                          </div>
                          <div className="h-1 bg-white/20 rounded-full overflow-hidden mx-1 mb-1">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.confidence}%` }}
                                className="h-full bg-primary" 
                             />
                          </div>
                       </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <Button size="icon" className="rounded-full h-12 w-12 bg-primary text-white shadow-2xl">
                        <ArrowUpRight className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight mb-3 line-clamp-1 text-white">{item.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-muted-foreground font-bold text-sm">
                          <MapPin className="w-4 h-4 text-primary" />
                          {item.location}
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground font-bold text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          {item.date}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full h-12 rounded-2xl border-white/40 dark:border-white/10 glass font-bold hover:bg-primary hover:text-white transition-all">
                      View Details
                    </Button>
                  </div>
                </GlassCard>
              ) : (
                <GlassCard 
                  hover
                  className="p-6 border-white/20 dark:border-white/5 !rounded-[2.5rem] group"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                     <div className="w-32 h-32 rounded-[2rem] overflow-hidden shrink-0 shadow-2xl">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     </div>
                     <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                          <h3 className="text-3xl font-black tracking-tighter text-white">{item.title}</h3>
                          <Badge variant={item.status === 'lost' ? "destructive" : "secondary"} className="glass px-3 font-black text-[10px] tracking-widest uppercase">{item.status}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 font-bold text-muted-foreground">
                          <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {item.location}</span>
                          <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {item.date}</span>
                        </div>
                     </div>
                     <Button className="rounded-2xl h-14 px-10 bg-primary text-white shadow-xl shadow-primary/20 font-bold group">
                        Details
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </Button>
                  </div>
                </GlassCard>
              )}
            </motion.div>
          )) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <SearchIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-2xl font-black tracking-tight text-white">No items found</p>
              <p className="text-muted-foreground font-medium">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center py-12 gap-4">
           {isLoading ? (
             <>
               <Loader2 className="w-10 h-10 text-primary animate-spin" />
               <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Fetching More Results...</p>
             </>
           ) : results.length > 0 && (
             <Button 
               variant="ghost" 
               className="rounded-2xl h-14 px-12 glass font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
               onClick={loadMore}
             >
               Load More Items
             </Button>
           )}
        </div>
      </main>

      <aside className="hidden xl:flex flex-col w-96 space-y-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
             <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
               <Activity className="w-5 h-5 text-primary" />
             </div>
             <h3 className="text-2xl font-black tracking-tight text-white">Campus Activity</h3>
          </div>
          <GlassCard className="p-6 border-white/20 dark:border-white/5 !rounded-[2.5rem] space-y-6 shadow-3xl">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4 group">
                 <div className="w-1 h-12 rounded-full bg-primary/20 group-hover:bg-primary transition-all shrink-0" />
                 <div className="flex-1 space-y-0.5">
                   <p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-white/90">{activity.msg}</p>
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{activity.time}</p>
                 </div>
                 {activity.type === 'match' && <Sparkles className="w-4 h-4 text-primary animate-pulse" />}
              </div>
            ))}
            <Button variant="outline" className="w-full rounded-2xl h-12 glass border-white/40 font-bold">View Full Activity Feed</Button>
          </GlassCard>
        </div>

        <GlassCard className="p-8 bg-primary/10 border-primary/20 !rounded-[2.5rem] space-y-6">
           <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Bell className="w-8 h-8 text-primary" />
           </div>
           <div className="space-y-2">
             <h4 className="text-2xl font-black tracking-tight text-white">Stay Updated</h4>
             <p className="text-sm text-muted-foreground font-medium leading-relaxed">
               Set up alerts for specific categories and get notified the moment a potential match is found.
             </p>
           </div>
           <Button 
             className="w-full rounded-2xl bg-primary text-white h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20"
             onClick={() => setIsAlertModalOpen(true)}
           >
             Set Alerts
           </Button>
        </GlassCard>
      </aside>
    </div>
  );
}
