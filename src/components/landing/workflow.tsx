import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Upload, UserCog, LineChart, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

const steps = [
  { step: "01", icon: Upload, title: "Import Employees", description: "Import employees via CSV or manual entry with built-in validation and duplicate detection.", color: "from-cyan-500 to-blue-500" },
  { step: "02", icon: UserCog, title: "Manage & Update", description: "Manage and update employee information, departments, roles, and organizational structure.", color: "from-emerald-500 to-teal-500" },
  { step: "03", icon: LineChart, title: "Track & Analyze", description: "Track analytics and audit logs to gain insights and ensure compliance.", color: "from-orange-500 to-amber-500" },
];

function WorkflowCard({ item, index }: { item: typeof steps[0]; index: number }) {
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
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.2, type: "spring" }}
      onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); mouseX.set(0); mouseY.set(0); }}
      style={{ perspective: 1000, rotateX: isHovered ? rotateX : 0, rotateY: isHovered ? rotateY : 0 }}
      className="relative cursor-pointer"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <motion.div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative z-10"
            animate={isHovered ? { scale: 1.1, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" } : { scale: 1, boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
            transition={{ type: "spring", stiffness: 300 }} style={{ transformStyle: "preserve-3d" }}>
            <motion.div animate={isHovered ? { rotateY: 360 } : {}} transition={{ duration: 0.8 }}>
              <item.icon className="w-8 h-8 text-indigo-400" />
            </motion.div>
            {isHovered && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div key={i} className="absolute"
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    animate={{ x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 80, scale: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 1, delay: i * 0.1, repeat: Infinity, repeatDelay: 0.5 }}>
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
          <motion.div className={`absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}
            animate={{ rotate: isHovered ? [0, 10, -10, 0] : 0, scale: isHovered ? 1.2 : 1 }} transition={{ duration: 0.5 }}>
            <span className="text-xs font-bold text-white">{item.step}</span>
          </motion.div>
          <motion.div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 blur-xl -z-10`}
            animate={{ opacity: isHovered ? 0.4 : 0 }} transition={{ duration: 0.3 }} />
        </div>
        <motion.h3 className="text-xl font-semibold text-white mb-3" animate={isHovered ? { y: -5 } : { y: 0 }} transition={{ type: "spring", stiffness: 300 }}>
          {item.title}
        </motion.h3>
        <motion.p className="text-white/50 text-sm leading-relaxed max-w-xs" animate={isHovered ? { y: -3, opacity: 1 } : { y: 0, opacity: 0.8 }} transition={{ type: "spring", stiffness: 300 }}>
          {item.description}
        </motion.p>
      </div>
      {index < steps.length - 1 && (
        <motion.div className="hidden lg:flex absolute top-10 -right-6 xl:-right-8 items-center justify-center z-20"
          animate={{ x: [0, 10, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowRight className="w-6 h-6 text-indigo-400" />
        </motion.div>
      )}
    </motion.div>
  );
}

export function Workflow() {
  return (
    <section className="py-24 relative overflow-hidden">
      <motion.div className="hidden lg:block absolute top-[calc(50%-80px)] left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"
        animate={{ scaleX: [0.8, 1, 0.8], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
      <motion.div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-cyan-500/10 blur-3xl"
        animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, -20, 0], scale: [1.2, 1, 1.2] }} transition={{ duration: 8, repeat: Infinity }} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <motion.span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase inline-block"
            animate={{ textShadow: ["0 0 10px rgba(99,102,241,0)", "0 0 10px rgba(99,102,241,0.5)", "0 0 10px rgba(99,102,241,0)"] }}
            transition={{ duration: 2, repeat: Infinity }}>
            How It Works
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-4 text-balance">Simple 3-Step Workflow</h2>
          <p className="text-white/50 max-w-2xl mx-auto">Get started in minutes with our streamlined HR management process.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((item, index) => (
            <WorkflowCard key={item.step} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
