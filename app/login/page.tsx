"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NetworkBackground } from "@/components/login/network-background";
import { Users, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [particles, setParticles] = useState<{ x: number; y: number; id: number }[]>([]);
  const [shake, setShake] = useState(false);
  
  const { login, isLoading, error } = useAuth();

  const triggerSuccessParticles = () => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      x: Math.random() * 360 - 180,
      y: Math.random() * 360 - 180,
      id: Date.now() + i,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      triggerSuccessParticles();
    } catch {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <NetworkBackground />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6"
      >
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-xl font-bold text-white">HRMS</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.header>

      {/* Login Card */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            x: shake ? [0, -10, 10, -10, 10, 0] : 0
          }}
          transition={{ duration: shake ? 0.5 : 0.7, delay: shake ? 0 : 0.2 }}
          className="w-full max-w-md relative"
        >
          {/* Success particles */}
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 1, 0.5],
                  x: particle.x,
                  y: particle.y,
                  opacity: [1, 1, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full pointer-events-none z-50"
                style={{
                  backgroundColor: ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            ))}
          </AnimatePresence>

          {/* Glassmorphism card */}
          <div className="relative">
            {/* Glow effect */}
            <motion.div 
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-cyan-500/30 rounded-2xl blur-xl" 
            />
            
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6, delay: 0.4 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  Welcome Back
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/60"
                >
                  Sign in to your HRMS dashboard
                </motion.p>
              </div>

              {/* Demo credentials notice */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-6 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
              >
                <p className="text-xs text-indigo-300 text-center">
                  Demo: <span className="font-mono">admin@hrms.com</span> / <span className="font-mono">admin123</span>
                </p>
              </motion.div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <label className="text-sm text-white/70">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-white/70">Password</label>
                    <button
                      type="button"
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full h-11 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium shadow-lg shadow-indigo-500/25 border-0 overflow-hidden group"
                  >
                    {/* Glow pulse effect */}
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(99, 102, 241, 0.3)",
                          "0 0 40px rgba(99, 102, 241, 0.5)",
                          "0 0 20px rgba(99, 102, 241, 0.3)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-md"
                    />
                    
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <span className="relative flex items-center justify-center">
                        Sign In
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </motion.form>

            </div>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-center"
          >
            <p className="text-white/30 text-xs mb-3">Trusted by enterprise teams worldwide</p>
            <div className="flex items-center justify-center gap-6 text-white/20">
              <span className="text-sm font-medium">256-bit SSL</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-sm font-medium">SOC 2 Compliant</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-sm font-medium">GDPR Ready</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
