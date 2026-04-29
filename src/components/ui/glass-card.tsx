import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  variant?: "light" | "dark" | "blue" | "purple" | "neutral";
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  variant = "light",
  hover = false,
  ...props
}: GlassCardProps) {
  const variants = {
    light: "bg-white/40 dark:bg-slate-900/40 border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]",
    dark: "bg-slate-900/60 border-white/5 shadow-2xl",
    blue: "bg-blue-500/5 border-blue-500/20 shadow-blue-500/5",
    purple: "bg-purple-500/5 border-purple-500/20 shadow-purple-500/5",
    neutral: "bg-transparent border-slate-200/50 dark:border-white/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      whileHover={hover ? { y: -5, scale: 1.01, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "backdrop-blur-xl border rounded-3xl p-6 transition-all duration-300",
        variants[variant],
        hover && "hover:shadow-2xl hover:bg-white/50 dark:hover:bg-slate-900/50",
        className
      )}
      {...props}
    >
      {/* Inner subtle glare effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none opacity-50" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

