import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-700">
      <GlassCard className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center mb-8 border-white/20 shadow-inner">
        <Icon className="w-10 h-10 text-primary" />
      </GlassCard>
      <h3 className="text-3xl font-black tracking-tighter mb-4">{title}</h3>
      <p className="text-muted-foreground text-lg font-medium max-w-sm mb-10 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <Button 
          onClick={onAction}
          className="rounded-2xl h-14 px-8 bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
