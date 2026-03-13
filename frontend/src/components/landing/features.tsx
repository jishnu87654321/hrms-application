import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Users, FileUp, History, BarChart2, Shield, Database } from "lucide-react";
import { useState } from "react";

const features = [
  { icon: Users, title: "Employee Management", description: "Manage employees, departments, and roles from a centralized dashboard with intuitive controls.", color: "from-cyan-500/20 to-blue-500/20" },
  { icon: FileUp, title: "Bulk CSV Upload", description: "Upload thousands of employees instantly with validation and duplicate prevention.", color: "from-emerald-500/20 to-teal-500/20" },
  { icon: History, title: "Audit Logs", description: "Track every admin action including create, update, delete, and bulk operations.", color: "from-orange-500/20 to-amber-500/20" },
  { icon: BarChart2, title: "Analytics Dashboard", description: "Visualize workforce data with charts such as department distribution and employment types.", color: "from-purple-500/20 to-pink-500/20" },
  { icon: Shield, title: "Secure Role-Based Access", description: "JWT authentication and admin role protection for enterprise-grade security.", color: "from-red-500/20 to-rose-500/20" },
  { icon: Database, title: "Centralized Database", description: "All employee data stored securely with real-time sync across all modules.", color: "from-indigo-500/20 to-violet-500/20" },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [10, -10]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-10, 10]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 20 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); setIsHovered(false); }}
      style={{ perspective: 1000, rotateX: isHovered ? rotateX : 0, rotateY: isHovered ? rotateY : 0, transformStyle: "preserve-3d" }}
      className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer"
    >
      <motion.div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        animate={isHovered ? { scale: [1, 1.02, 1] } : {}} transition={{ duration: 2, repeat: Infinity }} />
      <motion.div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/30 to-violet-500/30 opacity-0 blur-md -z-10"
        animate={{ opacity: isHovered ? 0.6 : 0 }} transition={{ duration: 0.3 }} />
      <div className="relative" style={{ transform: "translateZ(30px)" }}>
        <motion.div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors"
          animate={isHovered ? { rotateY: [0, 360], scale: [1, 1.1, 1] } : {}} transition={{ duration: 1, ease: "easeInOut" }}>
          <feature.icon className="w-6 h-6 text-indigo-400" />
        </motion.div>
        <motion.h3 className="text-lg font-semibold text-white mb-2" animate={isHovered ? { x: [0, 5, 0] } : {}} transition={{ duration: 0.5 }}>
          {feature.title}
        </motion.h3>
        <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
        {isHovered && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-indigo-400/60"
                initial={{ x: Math.random() * 100, y: Math.random() * 100, opacity: 0 }}
                animate={{ y: [null, -50], opacity: [0, 1, 0], scale: [0, 1, 0] }}
                transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }} />
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent" />
      <motion.div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full bg-violet-500/5 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1.2, 1, 1.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <motion.span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase inline-block" animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            Features
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-4 text-balance">Everything you need to manage HR</h2>
          <p className="text-white/50 max-w-2xl mx-auto">Powerful tools designed to streamline your HR operations and boost productivity.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
