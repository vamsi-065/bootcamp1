"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Check, Info, Trash2, MessageSquare, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  // Replace 'user_id_here' with actual user ID from Auth context
  const { notifications, markAsRead, clearAll } = useNotifications('user_id_here');

  const getIcon = (type: string) => {
    switch (type) {
      case 'match': return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-primary" />;
      case 'status': return <Check className="w-5 h-5 text-emerald-500" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-destructive" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-[70] p-6"
          >
            <GlassCard 
              variant="dark"
              className="h-full flex flex-col p-0 overflow-hidden border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] !rounded-[3rem]"
            >
              {/* Header */}
              <div className="p-8 flex items-center justify-between border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shadow-inner">
                    <Bell className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">Notifications</h2>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-0.5">Stay up to date</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 w-10 h-10" onClick={onClose}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-40">
                     <Bell className="w-16 h-16" />
                     <p className="text-sm font-black uppercase tracking-widest">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notif, idx) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => !notif.read && markAsRead(notif.id)}
                      className={cn(
                        "group p-6 rounded-[2rem] border transition-all duration-500 relative overflow-hidden cursor-pointer",
                        notif.read 
                          ? "bg-white/5 border-white/5 opacity-50 grayscale" 
                          : "bg-white/10 border-primary/20 shadow-xl ring-1 ring-primary/10"
                      )}
                    >
                      {!notif.read && <div className="absolute top-6 right-6 w-2 h-2 bg-primary rounded-full animate-ping" />}
                      <div className="flex gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          {getIcon(notif.type || 'info')}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-black text-base tracking-tight">{notif.title}</p>
                          <p className="text-sm text-muted-foreground font-medium leading-relaxed">{notif.message}</p>
                          <p className="text-[10px] font-black text-primary/70 uppercase tracking-widest mt-3">
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-white/10 bg-white/5 flex gap-4">
                <Button 
                  variant="ghost" 
                  className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs hover:bg-destructive/10 hover:text-destructive transition-all"
                  onClick={clearAll}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
                <Button 
                  className="flex-1 rounded-2xl h-14 bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
                  onClick={clearAll}
                >
                  Mark All Read
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

