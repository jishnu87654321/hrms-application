"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

export function CTA() {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [5, -5]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-5, 5]), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Floating background orbs */}
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-chart-2/10 blur-3xl"
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            mouseX.set(0);
            mouseY.set(0);
          }}
          style={{
            perspective: 1000,
            rotateX: isHovered ? rotateX : 0,
            rotateY: isHovered ? rotateY : 0,
          }}
          className="relative rounded-3xl overflow-hidden cursor-pointer"
        >
          {/* Background with gradient */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-accent/20 via-card to-card"
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
          
          {/* Animated grid pattern */}
          <motion.div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
            animate={{ 
              backgroundPosition: ['0px 0px', '40px 40px'],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Glowing border effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-accent/0"
            animate={{ borderColor: isHovered ? 'rgba(56, 189, 248, 0.3)' : 'rgba(56, 189, 248, 0)' }}
            transition={{ duration: 0.3 }}
          />

          {/* Floating sparkles */}
          {isHovered && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [0, -30],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-3 h-3 text-accent" />
                </motion.div>
              ))}
            </>
          )}
          
          <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center" style={{ transform: "translateZ(30px)" }}>
            {/* Floating icon */}
            <motion.div
              className="absolute top-8 right-8 hidden sm:block"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance"
            >
              <motion.span
                animate={isHovered ? { 
                  textShadow: [
                    "0 0 20px rgba(56, 189, 248, 0)",
                    "0 0 20px rgba(56, 189, 248, 0.5)",
                    "0 0 20px rgba(56, 189, 248, 0)"
                  ]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Start Managing Your Workforce Smarter
              </motion.span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10"
            >
              Join hundreds of organizations already using HRMS to streamline their HR operations 
              and build better workplaces.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -3 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="group relative overflow-hidden">
                  <motion.span
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                  Launch HRMS
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -3 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="border-border hover:bg-secondary">
                  <Mail className="mr-2 w-4 h-4" />
                  Contact Admin
                </Button>
              </motion.div>
            </motion.div>

            {/* Animated stats below buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-border/50"
            >
              {[
                { value: "500+", label: "Companies" },
                { value: "99.9%", label: "Uptime" },
                { value: "24/7", label: "Support" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                  className="text-center"
                >
                  <motion.div 
                    className="text-2xl font-bold text-accent"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* 3D Glow effect */}
          <motion.div
            className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-accent/20 via-chart-2/20 to-accent/20 -z-10 blur-2xl"
            animate={{ opacity: isHovered ? 0.6 : 0.2 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
