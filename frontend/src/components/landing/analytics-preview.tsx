import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useState, useEffect } from "react";

const generateDepartmentData = () => [
  { name: "Engineering", value: 25 + Math.random() * 20, color: "#6366f1" },
  { name: "Sales", value: 15 + Math.random() * 20, color: "#8b5cf6" },
  { name: "Marketing", value: 10 + Math.random() * 20, color: "#06b6d4" },
  { name: "HR", value: 5 + Math.random() * 15, color: "#f59e0b" },
  { name: "Finance", value: 5 + Math.random() * 10, color: "#10b981" },
];

const generateEmploymentTypes = () => [
  { name: "Full-time", count: 700 + Math.floor(Math.random() * 300) },
  { name: "Part-time", count: 80 + Math.floor(Math.random() * 80) },
  { name: "Contract", count: 120 + Math.floor(Math.random() * 100) },
  { name: "Intern", count: 50 + Math.floor(Math.random() * 80) },
];

const generateMonthlyJoiners = () => [
  { month: "Jan", joiners: 8 + Math.floor(Math.random() * 20) },
  { month: "Feb", joiners: 10 + Math.floor(Math.random() * 20) },
  { month: "Mar", joiners: 15 + Math.floor(Math.random() * 20) },
  { month: "Apr", joiners: 10 + Math.floor(Math.random() * 20) },
  { month: "May", joiners: 18 + Math.floor(Math.random() * 20) },
  { month: "Jun", joiners: 20 + Math.floor(Math.random() * 20) },
];

export function AnalyticsPreview() {
  const [departmentData, setDepartmentData] = useState(generateDepartmentData());
  const [employmentTypes, setEmploymentTypes] = useState(generateEmploymentTypes());
  const [monthlyJoiners, setMonthlyJoiners] = useState(generateMonthlyJoiners());
  const [isHovered, setIsHovered] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDepartmentData(generateDepartmentData());
      setEmploymentTypes(generateEmploymentTypes());
      setMonthlyJoiners(generateMonthlyJoiners());
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/[0.02]" />
      <motion.div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-indigo-500/10 blur-xl"
        animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-violet-500/10 blur-xl"
        animate={{ y: [0, 20, 0], x: [0, -15, 0], scale: [1, 1.15, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <motion.span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase inline-block" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            Live Analytics
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-4 text-balance">Powerful HR Analytics</h2>
          <p className="text-white/50 max-w-2xl mx-auto">Gain insights into your workforce with real-time analytics and beautiful visualizations.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
            viewport={{ once: true }} transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            onHoverStart={() => setIsHovered(0)} onHoverEnd={() => setIsHovered(null)}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 cursor-pointer">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Headcount by Department</h3>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-2 h-2 rounded-full bg-indigo-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={departmentData} cx="50%" cy="50%" innerRadius={isHovered === 0 ? 45 : 50} outerRadius={isHovered === 0 ? 85 : 80} paddingAngle={4} dataKey="value">
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: isHovered === 0 ? "drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))" : "none", transition: "all 0.3s ease" }} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {departmentData.map((dept, i) => (
                <motion.div key={dept.name} className="flex items-center gap-2" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                  <span className="text-xs text-white/50">{dept.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
            viewport={{ once: true }} transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            onHoverStart={() => setIsHovered(1)} onHoverEnd={() => setIsHovered(null)}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 cursor-pointer">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Employment Types</h3>
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-violet-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employmentTypes} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} width={80} />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={28} animationDuration={500}
                    style={{ filter: isHovered === 1 ? "drop-shadow(0 0 10px rgba(99, 102, 241, 0.6))" : "none" }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4 px-2">
              {employmentTypes.map((type, i) => (
                <motion.div key={type.name} animate={{ y: [0, -3, 0] }} transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }} className="text-center">
                  <div className="text-sm font-bold text-indigo-400">{type.count}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Area Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
            viewport={{ once: true }} transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            onHoverStart={() => setIsHovered(2)} onHoverEnd={() => setIsHovered(null)}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 cursor-pointer">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Monthly Joiners</h3>
              <motion.div animate={{ x: [0, 5, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              </motion.div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyJoiners}>
                  <defs>
                    <linearGradient id="colorJoiners" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                  <Area type="monotone" dataKey="joiners" stroke="#6366f1" strokeWidth={3} fill="url(#colorJoiners)" animationDuration={500}
                    style={{ filter: isHovered === 2 ? "drop-shadow(0 0 12px rgba(99, 102, 241, 0.7))" : "none" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Live indicator */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center justify-center gap-2 mt-8">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm text-white/50">Live data updating every 2.5 seconds</span>
        </motion.div>
      </div>
    </section>
  );
}
