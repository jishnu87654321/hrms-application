import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Mail, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

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
      <motion.div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl"
        animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-violet-500/10 blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, -20, 0], scale: [1.2, 1, 1.2] }} transition={{ duration: 8, repeat: Infinity }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); mouseX.set(0); mouseY.set(0); }}
          style={{ perspective: 1000, rotateX: isHovered ? rotateX : 0, rotateY: isHovered ? rotateY : 0 }}
          className="relative rounded-3xl overflow-hidden cursor-pointer"
        >
          <motion.div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-[#0c0a1d]/80 to-[#0c0a1d]/80"
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }} transition={{ duration: 0.5 }} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
          <motion.div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
            animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
          <motion.div className="absolute inset-0 rounded-3xl border-2 border-indigo-500/0"
            animate={{ borderColor: isHovered ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0)' }} transition={{ duration: 0.3 }} />

          {isHovered && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div key={i} className="absolute" style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%` }}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], y: [0, -30] }}
                  transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}>
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                </motion.div>
              ))}
            </>
          )}

          <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
            <motion.div className="absolute top-8 right-8 hidden sm:block"
              animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
              <motion.span animate={isHovered ? { textShadow: ["0 0 20px rgba(99,102,241,0)", "0 0 20px rgba(99,102,241,0.5)", "0 0 20px rgba(99,102,241,0)"] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}>
                Start Managing Your Workforce Smarter
              </motion.span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto mb-10">
              Join hundreds of organizations already using HRMS to streamline their HR operations and build better workplaces.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login">
                  <button className="px-6 py-3 bg-white text-[#0c0a1d] rounded-md font-medium flex items-center gap-2 hover:bg-white/90 transition-colors group relative overflow-hidden">
                    <motion.span className="absolute inset-0 bg-indigo-200/40" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />
                    Launch HRMS <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
                <button className="px-6 py-3 border border-white/20 text-white rounded-md hover:bg-white/10 transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Contact Admin
                </button>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-white/10">
              {[{ value: "500+", label: "Companies" }, { value: "99.9%", label: "Uptime" }, { value: "24/7", label: "Support" }].map((stat, i) => (
                <motion.div key={stat.label} animate={{ y: [0, -5, 0] }} transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }} className="text-center">
                  <motion.div className="text-2xl font-bold text-indigo-400" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}>
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-indigo-500/20 -z-10 blur-2xl"
            animate={{ opacity: isHovered ? 0.6 : 0.2 }} transition={{ duration: 0.3 }} />
        </motion.div>
      </div>
    </section>
  );
}
