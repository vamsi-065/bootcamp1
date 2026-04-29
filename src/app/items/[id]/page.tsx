"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  MessageCircle, 
  ShieldCheck,
  Share2,
  Flag,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ItemDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href="/search">
          <Button variant="ghost" size="sm" className="rounded-full gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="aspect-square rounded-3xl overflow-hidden glass border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop" 
                alt="Item" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="aspect-square rounded-xl overflow-hidden glass border-white/10 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                    <img src={`https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop&sig=${i}`} alt="Thumb" className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Details */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="destructive" className="glass border-none px-4 py-1 font-bold">LOST</Badge>
                <Badge variant="outline" className="rounded-full border-primary/30 text-primary">Electronics</Badge>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">MacBook Air M2 - Space Gray</h1>
              <p className="text-muted-foreground leading-relaxed">
                Left on the second floor of the Main Library, near the quiet study pods. 
                It has a sticker of a space shuttle on the lid and a small scratch on the bottom left corner.
              </p>
            </div>

            <GlassCard className="p-6 grid grid-cols-2 gap-8 border-white/10">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</p>
                <div className="flex items-center gap-2 font-medium">
                  <MapPin className="w-4 h-4 text-primary" />
                  Main Library, F2
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date Reported</p>
                <div className="flex items-center gap-2 font-medium">
                  <Calendar className="w-4 h-4 text-primary" />
                  March 24, 2026
                </div>
              </div>
            </GlassCard>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Reporter Information</h3>
              <GlassCard className="p-4 border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold">JD</div>
                  <div>
                    <p className="font-bold">John Doe</p>
                    <p className="text-xs text-muted-foreground">Student · Computer Science</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Student
                </div>
              </GlassCard>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1 h-14 rounded-2xl text-lg shadow-xl shadow-primary/20 group">
                <MessageCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Contact Reporter
              </Button>
              <Button size="lg" variant="outline" className="h-14 rounded-2xl glass px-8">
                <Flag className="w-5 h-5" />
              </Button>
            </div>

            <div className="pt-8 border-t border-border flex items-center justify-between">
               <div className="flex items-center gap-6">
                 <button className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
                   <Share2 className="w-4 h-4" /> Share
                 </button>
                 <button className="text-sm font-medium text-muted-foreground hover:text-destructive flex items-center gap-2">
                   <Flag className="w-4 h-4" /> Report Inappropriate
                 </button>
               </div>
               <p className="text-xs text-muted-foreground italic">Reference ID: #L-102934</p>
            </div>
          </div>
        </div>

        {/* Similar Items Section */}
        <section className="pt-16 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Similar Items</h2>
            <Link href="/search" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
             {[1,2,3,4].map(i => (
               <div key={i} className="glass rounded-2xl p-4 space-y-3 border-white/10 hover:border-primary/30 transition-all cursor-pointer">
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={`https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=200&fit=crop&sig=${i+10}`} alt="Item" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-bold text-sm line-clamp-1">MacBook Pro - Space Gray</h4>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> Student Center</p>
               </div>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
}
