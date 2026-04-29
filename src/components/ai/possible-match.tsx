"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Info } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Match {
  id: string;
  title: string;
  image_url: string;
  similarity: number;
  category: string;
  location: string;
}

interface PossibleMatchFoundProps {
  matches: Match[];
  onSelect: (matchId: string) => void;
}

export function PossibleMatchFound({ matches, onSelect }: PossibleMatchFoundProps) {
  if (matches.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        </div>
        <div>
          <h3 className="text-2xl font-black tracking-tighter">AI Match Detected</h3>
          <p className="text-sm text-muted-foreground font-medium">Our vision model found similar items on campus.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map((match, idx) => (
          <GlassCard 
            key={match.id}
            hover
            className="p-4 border-primary/20 bg-primary/5 !rounded-[2.5rem] overflow-hidden group relative"
          >
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden shadow-2xl shrink-0">
                <img src={match.image_url} alt={match.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex justify-between items-start">
                   <Badge className="bg-primary/20 text-primary border-none font-black text-[10px] px-3 py-1 rounded-full">
                     {Math.round(match.similarity * 100)}% Match
                   </Badge>
                   <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <h4 className="text-lg font-black tracking-tight truncate">{match.title}</h4>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{match.location}</p>
                <Button 
                  onClick={() => onSelect(match.id)}
                  variant="ghost" 
                  size="sm" 
                  className="h-9 rounded-xl font-bold text-primary hover:bg-primary/10 p-0 group"
                >
                  View Potential Match
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
            
            {/* Visual Glare for AI effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none opacity-50" />
          </GlassCard>
        ))}
      </div>

      <GlassCard variant="neutral" className="p-4 flex items-center gap-3 border-white/10 !rounded-2xl">
        <Info className="w-4 h-4 text-primary shrink-0" />
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
          AI suggestions are based on image similarity and may not be 100% accurate.
        </p>
      </GlassCard>
    </motion.div>
  );
}
