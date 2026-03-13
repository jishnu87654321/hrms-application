"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Database, Zap, Target, ClipboardCheck, TrendingUp, Check, Sparkles } from "lucide-react";
import { useState } from "react";

const benefits = [
  {
    icon: Database,
    title: "Centralized Employee Database",
    description: "All employee data in one secure, accessible location.",
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
  {
    icon: Zap,
    title: "Faster HR Operations",
    description: "Automate repetitive tasks and reduce manual workload.",
    gradient: "from-yellow-500/20 to-orange-500/20",
  },
  {
    icon: Target,
    title: "Data Accuracy",
    description: "Eliminate errors with validation and duplicate prevention.",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: ClipboardCheck,
    title: "Compliance & Tracking",
    description: "Maintain audit trails and ensure regulatory compliance.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: TrendingUp,
    title: "Scalable Management",
    description: "Grow your workforce without growing your HR complexity.",
    gradient: "from-red-500/20 to-rose-500/20",
  },
];

function BenefitCard({ benefit, index }: { benefit: typeof benefits[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-50, 50], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-50, 50], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
      whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
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
      className={`p-6 rounded-2xl bg-card/50 backdrop-blur border border-border cursor-pointer ${
        index === 1 ? "mt-8" : index === 3 ? "mt-8" : ""
      }`}
    >
      {/* Gradient overlay */}
      <motion.div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.gradient} opacity-0`}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl bg-accent/20 blur-xl -z-10"
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative">
        <motion.div 
          className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4"
          animate={isHovered ? { 
            scale: 1.1,
            rotateY: 180
          } : {
            scale: 1,
            rotateY: 0
          }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <benefit.icon className="w-6 h-6 text-accent" />
        </motion.div>

        <motion.h3 
          className="font-semibold text-foreground text-sm mb-1"
          animate={isHovered ? { x: 5 } : { x: 0 }}
          transition={{ type: "spring" }}
        >
          {benefit.title}
        </motion.h3>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {benefit.description}
        </p>

        {/* Floating sparkles on hover */}
        {isHovered && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 60,
                  y: (Math.random() - 0.5) * 60,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.15,
                  repeat: Infinity,
                }}
              >
                <Sparkles className="w-2 h-2 text-accent" />
              </motion.div>
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}

export function Benefits() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
      
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl"
        animate={{ 
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 -right-32 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl"
        animate={{ 
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1.2, 1, 1.2]
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.span 
              className="text-accent text-sm font-semibold tracking-wider uppercase inline-block"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Benefits
            </motion.span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4 mb-6 text-balance">
              Why organizations choose HRMS
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Transform your HR operations with a platform designed for modern workforce management. 
              Experience the benefits of centralized, automated, and intelligent HR solutions.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ type: "spring" }}
                  >
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Visual Cards with 3D */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {benefits.slice(0, 4).map((benefit, index) => (
                <BenefitCard key={benefit.title} benefit={benefit} index={index} />
              ))}
            </div>

            {/* Decorative 3D floating element */}
            <motion.div
              className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64"
              animate={{ 
                rotateZ: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-full h-full rounded-full bg-accent/5 blur-3xl" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
