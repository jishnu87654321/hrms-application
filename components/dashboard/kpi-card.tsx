"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  prefix?: string;
  trend?: { value: number; isPositive: boolean };
  delay?: number;
  color?: "indigo" | "violet" | "cyan" | "emerald";
}

const colorVariants = {
  indigo: {
    bg: "from-indigo-500/20 to-indigo-600/10",
    border: "border-indigo-500/30",
    icon: "text-indigo-400",
    glow: "shadow-indigo-500/20"
  },
  violet: {
    bg: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/30",
    icon: "text-violet-400",
    glow: "shadow-violet-500/20"
  },
  cyan: {
    bg: "from-cyan-500/20 to-cyan-600/10",
    border: "border-cyan-500/30",
    icon: "text-cyan-400",
    glow: "shadow-cyan-500/20"
  },
  emerald: {
    bg: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/30",
    icon: "text-emerald-400",
    glow: "shadow-emerald-500/20"
  }
};

export function KPICard({
  title,
  value,
  icon: Icon,
  suffix = "",
  prefix = "",
  trend,
  delay = 0,
  color = "indigo"
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const colors = colorVariants[color];

  // Count up animation
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300",
        `bg-gradient-to-br ${colors.bg} ${colors.border}`,
        isHovered && `shadow-2xl ${colors.glow}`
      )}
    >
      {/* Glow effect on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-violet-500/5 pointer-events-none"
      />
      
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <motion.p
            key={displayValue}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-foreground"
          >
            {prefix}
            {displayValue.toLocaleString()}
            {suffix}
          </motion.p>
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.isPositive ? "text-emerald-400" : "text-red-400"
              )}
            >
              <span>{trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs last month</span>
            </motion.div>
          )}
        </div>
        
        <motion.div
          animate={isHovered ? { 
            rotate: [0, -10, 10, 0],
            scale: [1, 1.2, 1]
          } : {}}
          transition={{ duration: 0.5 }}
          className={cn(
            "p-3 rounded-xl bg-gradient-to-br",
            colors.bg
          )}
        >
          <Icon className={cn("w-6 h-6", colors.icon)} />
        </motion.div>
      </div>
    </motion.div>
  );
}
