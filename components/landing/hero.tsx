"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, BarChart3, FileSpreadsheet, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Hero() {
  const [barHeights, setBarHeights] = useState([60, 85, 45, 70, 55, 90, 40, 75]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), { stiffness: 100, damping: 30 });
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setBarHeights(prev => prev.map(() => 30 + Math.random() * 60));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="w-4 h-4" />
              </motion.div>
              Enterprise-Grade HR Platform
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance cursor-pointer"
              whileHover={{ 
                scale: 1.02,
                y: -5,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.span
                className="inline-block"
                whileHover={{ 
                  color: "var(--accent)",
                  textShadow: "0 0 30px rgba(139, 92, 246, 0.6)",
                }}
              >
                Manage Your Workforce from{" "}
              </motion.span>
              <motion.span 
                className="text-accent inline-block"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(139, 92, 246, 0)",
                    "0 0 30px rgba(139, 92, 246, 0.6)",
                    "0 0 20px rgba(139, 92, 246, 0)"
                  ]
                }}
                whileHover={{
                  scale: 1.05,
                  textShadow: "0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(139, 92, 246, 0.4)",
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                One Intelligent Platform
              </motion.span>
            </motion.h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              HRMS helps organizations manage employees, departments, onboarding, and workforce analytics in one centralized system. Streamline your HR operations with powerful automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="group" onClick={() => router.push("/login")}>
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="border-border hover:bg-secondary" onClick={() => router.push("/login")}>
                  Admin Login
                </Button>
              </motion.div>
            </div>

            {/* Animated Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border"
            >
              {[
                { value: "10K+", label: "Employees Managed" },
                { value: "500+", label: "Organizations" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.1, y: -5 }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ 
                    y: { duration: 2, delay: i * 0.3, repeat: Infinity },
                    scale: { type: "spring", stiffness: 300 }
                  }}
                >
                  <motion.div 
                    className="text-2xl sm:text-3xl font-bold text-foreground"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
            style={{ perspective: 1000 }}
          >
            <motion.div 
              className="relative rounded-2xl bg-card/50 backdrop-blur-xl border border-border p-6 shadow-2xl"
              style={{ 
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
              }}
            >
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between mb-6" style={{ transform: "translateZ(20px)" }}>
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center"
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Users className="w-5 h-5 text-accent" />
                  </motion.div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Employee Dashboard</div>
                    <div className="text-xs text-muted-foreground">Real-time workforce overview</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                      className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-chart-4' : i === 1 ? 'bg-accent' : 'bg-chart-2'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Mock Stats Cards with 3D effect */}
              <div className="grid grid-cols-3 gap-4 mb-6" style={{ transform: "translateZ(40px)" }}>
                {[
                  { icon: Users, label: "Total Employees", value: "1,247" },
                  { icon: FileSpreadsheet, label: "Departments", value: "12" },
                  { icon: Clock, label: "Pending Tasks", value: "34" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="p-4 rounded-xl bg-secondary/50 border border-border"
                  >
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                    >
                      <stat.icon className="w-5 h-5 text-accent mb-2" />
                    </motion.div>
                    <motion.div 
                      className="text-xl font-bold text-foreground"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Animated Chart */}
              <div className="rounded-xl bg-secondary/30 border border-border p-4" style={{ transform: "translateZ(30px)" }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-foreground">Department Distribution</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </div>
                <div className="flex items-end gap-2 h-32">
                  {barHeights.map((height, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: `${height}%` }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 100, 
                        damping: 15,
                        mass: 0.5
                      }}
                      className="flex-1 bg-gradient-to-t from-accent/40 to-accent rounded-t relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{ y: [100, -100] }}
                        transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 3D Glow effect */}
              <motion.div
                className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent/20 via-chart-2/20 to-accent/20 -z-10 blur-xl"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>

            {/* Floating Cards with enhanced 3D */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1, rotateZ: 5 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="absolute -left-8 top-1/4 p-4 rounded-xl bg-card/80 backdrop-blur border border-border shadow-xl hidden lg:block"
              style={{ transform: "translateZ(60px)" }}
            >
              <motion.div 
                className="flex items-center gap-3"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div 
                  className="w-8 h-8 rounded-full bg-chart-4/20 flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Shield className="w-4 h-4 text-chart-4" />
                </motion.div>
                <div>
                  <div className="text-sm font-medium text-foreground">Secure Access</div>
                  <div className="text-xs text-muted-foreground">JWT Protected</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1, rotateZ: -5 }}
              transition={{ delay: 0.9, type: "spring" }}
              className="absolute -right-8 bottom-1/4 p-4 rounded-xl bg-card/80 backdrop-blur border border-border shadow-xl hidden lg:block"
            >
              <motion.div 
                className="flex items-center gap-3"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3, delay: 0.5, repeat: Infinity }}
              >
                <motion.div 
                  className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FileSpreadsheet className="w-4 h-4 text-accent" />
                </motion.div>
                <div>
                  <div className="text-sm font-medium text-foreground">Bulk Import</div>
                  <div className="text-xs text-muted-foreground">CSV Upload Ready</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
