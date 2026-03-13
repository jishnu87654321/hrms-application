"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Building2, UserPlus, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { KPICard } from "@/components/dashboard/kpi-card";
import { AnimatedBarChart, AnimatedDonutChart, AnimatedAreaChart } from "@/components/dashboard/animated-charts";
import { KPICardSkeleton, ChartSkeleton, TableRowSkeleton } from "@/components/dashboard/loading-skeleton";
import { staggerContainer } from "@/lib/animations";

// Mock data - replace with API calls
const mockStats = {
  totalEmployees: 1247,
  departments: 12,
  newHires: 34,
  growthRate: 12.5,
  pendingTasks: 8,
  completedTasks: 156
};

const departmentData = [
  { name: "Engineering", value: 320 },
  { name: "Sales", value: 180 },
  { name: "Marketing", value: 95 },
  { name: "HR", value: 45 },
  { name: "Finance", value: 67 },
  { name: "Operations", value: 112 },
];

const monthlyHiresData = [
  { name: "Jan", value: 24 },
  { name: "Feb", value: 32 },
  { name: "Mar", value: 28 },
  { name: "Apr", value: 45 },
  { name: "May", value: 38 },
  { name: "Jun", value: 52 },
  { name: "Jul", value: 34 },
];

const employeeGrowthData = [
  { name: "Jan", value: 1050 },
  { name: "Feb", value: 1082 },
  { name: "Mar", value: 1110 },
  { name: "Apr", value: 1155 },
  { name: "May", value: 1193 },
  { name: "Jun", value: 1247 },
];

const recentEmployees = [
  { id: "1", name: "Sarah Johnson", department: "Engineering", position: "Senior Developer", date: "2024-01-15" },
  { id: "2", name: "Michael Chen", department: "Sales", position: "Account Executive", date: "2024-01-14" },
  { id: "3", name: "Emily Davis", department: "Marketing", position: "Content Manager", date: "2024-01-13" },
  { id: "4", name: "James Wilson", department: "HR", position: "Recruiter", date: "2024-01-12" },
  { id: "5", name: "Lisa Anderson", department: "Finance", position: "Accountant", date: "2024-01-11" },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here is your workforce overview.</p>
        </div>
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(99, 102, 241, 0.2)",
              "0 0 40px rgba(99, 102, 241, 0.4)",
              "0 0 20px rgba(99, 102, 241, 0.2)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium"
        >
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
        </motion.div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {isLoading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <KPICardSkeleton key={i} />
            ))}
          </>
        ) : (
          <>
            <KPICard
              title="Total Employees"
              value={mockStats.totalEmployees}
              icon={Users}
              trend={{ value: 8.2, isPositive: true }}
              delay={0}
              color="indigo"
            />
            <KPICard
              title="Departments"
              value={mockStats.departments}
              icon={Building2}
              delay={0.1}
              color="violet"
            />
            <KPICard
              title="New Hires"
              value={mockStats.newHires}
              icon={UserPlus}
              suffix=" this month"
              trend={{ value: 12.5, isPositive: true }}
              delay={0.2}
              color="cyan"
            />
            <KPICard
              title="Growth Rate"
              value={mockStats.growthRate}
              icon={TrendingUp}
              suffix="%"
              delay={0.3}
              color="emerald"
            />
            <KPICard
              title="Pending Tasks"
              value={mockStats.pendingTasks}
              icon={Clock}
              delay={0.4}
              color="violet"
            />
            <KPICard
              title="Completed"
              value={mockStats.completedTasks}
              icon={CheckCircle}
              delay={0.5}
              color="emerald"
            />
          </>
        )}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Hires</h3>
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <AnimatedBarChart data={monthlyHiresData} delay={0.5} />
          )}
        </motion.div>

        {/* Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Department Distribution</h3>
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <AnimatedDonutChart data={departmentData} delay={0.6} />
          )}
        </motion.div>
      </div>

      {/* Area Chart - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Employee Growth Trend</h3>
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <AnimatedAreaChart data={employeeGrowthData} delay={0.7} />
        )}
      </motion.div>

      {/* Recent Employees Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Employees</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Department</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Position</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Join Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
              ) : (
                recentEmployees.map((employee, index) => (
                  <motion.tr
                    key={employee.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.05)" }}
                    className="border-b border-border/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-medium">
                          {employee.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{employee.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-medium">
                        {employee.department}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{employee.position}</td>
                    <td className="px-4 py-4 text-muted-foreground">{employee.date}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
