"use client";

import { Badge } from "@/components/ui/badge"
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, PlusCircle, Bell, ArrowRight, ShieldCheck, MapPin, Sparkles, MessageSquare, Zap, Target, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-12 md:py-24 relative overflow-hidden text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-black uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Driven Campus Intelligence</span>
          </motion.div>

          <div className="space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] break-words"
            >
              The Smart Way <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-indigo-600">
                To Recover.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed"
            >
              UniLost uses advanced AI vision and real-time synchronization to reunite you with your belongings faster than ever before.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-4"
          >
            <Link href="/report">
              <Button 
                size="lg" 
                className="relative rounded-[2rem] px-12 h-20 text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] border-none group overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Report Lost Item
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-500" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </Link>
            <Link href="/search">
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-[2rem] px-12 h-20 text-2xl font-black glass border-white/30 dark:border-white/10 hover:border-primary/50 backdrop-blur-xl group transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
              >
                <span className="flex items-center gap-3">
                  Browse Found Items
                  <Search className="w-7 h-7 group-hover:rotate-12 transition-transform duration-500" />
                </span>
              </Button>
            </Link>
          </motion.div>

          {/* Stats Marquee */}
          <div className="pt-20 opacity-40 grayscale flex flex-wrap justify-center gap-6 sm:gap-12 text-[10px] sm:text-sm font-black uppercase tracking-[0.3em]">
            <div className="flex items-center gap-2"><Target className="w-4 h-4" /> 89% Match Rate</div>
            <div className="flex items-center gap-2"><Zap className="w-4 h-4" /> Real-time Sync</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Verified Only</div>
          </div>
        </section>

        {/* AI & Realtime Showcase */}
        <section className="px-6 py-32 bg-white/5 dark:bg-black/20 backdrop-blur-3xl border-y border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <Badge className="bg-primary/20 text-primary border-none px-4 py-1 font-black uppercase tracking-widest">Hackathon Special</Badge>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                AI Vision <br />
                <span className="text-muted-foreground/50">Meets Realtime.</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                We've integrated CLIP-AI to analyze your photos and suggest matches instantly. Combined with Supabase Realtime, coordination happens in the blink of an eye.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <h4 className="text-3xl font-black tracking-tighter text-primary">0.4s</h4>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Match Latency</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-3xl font-black tracking-tighter text-primary">256-bit</h4>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Vector Precision</p>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-700" />
              <GlassCard className="p-8 border-white/20 !rounded-[3rem] shadow-3xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black tracking-tight">Active Coordination</p>
                    <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Live Now</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/10 w-[80%]">
                    <p className="text-sm font-medium">Is this the MacBook you lost in Lib 2?</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/20 border border-primary/20 w-[80%] ml-auto">
                    <p className="text-sm font-medium">Yes! The serial number matches!</p>
                  </div>
                  <div className="flex justify-center pt-4">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-6 py-2 rounded-full font-black uppercase tracking-tighter">
                      Match Verified by AI
                    </Badge>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-32 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24 space-y-4">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-4xl md:text-7xl font-black tracking-tighter"
              >
                Campus Ready.
              </motion.h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                Designed specifically for the university environment with security and efficiency at its core.
              </p>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <FeatureCard
                icon={<Sparkles className="w-8 h-8 text-primary" />}
                title="Semantic Search"
                description="Our AI matches items using both text descriptions and images. No photo? No problem."
              />
              <FeatureCard
                icon={<Zap className="w-8 h-8 text-primary" />}
                title="Reward System"
                description="Earn credits and contributor badges for helping fellow students recover their belongings."
              />
              <FeatureCard
                icon={<Clock className="w-8 h-8 text-primary" />}
                title="Smart Cleanup"
                description="Items automatically move to donation after 30 days, keeping the campus clutter-free."
              />
              <FeatureCard
                icon={<ShieldCheck className="w-8 h-8 text-primary" />}
                title="Verified Recovery"
                description="Multi-factor verification ensures items are returned to their rightful owners."
              />
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-16 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl">
                <Search className="text-white w-7 h-7" />
              </div>
              <span className="text-3xl font-black tracking-tighter">UniLost</span>
            </div>
            <p className="text-muted-foreground text-lg max-w-sm font-medium leading-relaxed">
              Empowering student recovery through intelligent AI and real-time coordination since 2026.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-widest text-[10px] text-primary">Explore</h4>
            <ul className="space-y-2 text-muted-foreground font-black text-sm uppercase tracking-wider">
              <li><Link href="/search" className="hover:text-primary transition-colors">Search Map</Link></li>
              <li><Link href="/report" className="hover:text-primary transition-colors">Report Lost</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Your Panel</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-widest text-[10px] text-primary">Resources</h4>
            <ul className="space-y-2 text-muted-foreground font-black text-sm uppercase tracking-wider">
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Portal</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Use</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">© 2026 UNILOST CORE. BUILT FOR HACKATHONS.</p>
          <div className="flex gap-8">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-all font-black text-xs uppercase tracking-widest">GitHub</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-all font-black text-xs uppercase tracking-widest">X / Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}>
      <GlassCard
        hover
        className="h-full group !rounded-[3rem] border-white/20 dark:border-white/5 p-10"
      >
        <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-700 shadow-inner">
          {icon}
        </div>
        <h3 className="text-3xl font-black mb-4 tracking-tight">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-lg font-medium">{description}</p>
      </GlassCard>
    </motion.div>
  );
}



