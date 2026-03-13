import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserPlus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LabelList,
  PieChart,
  Pie,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import { dashboardService } from '../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalEmployees: 0,
    activeEmployees: 0,
    newThisMonth: 0,
    departmentStats: [],
    employmentTypes: [
      { name: "Full Time", value: 0 },
      { name: "Intern", value: 0 }
    ],
    recentJoins: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        const apiStats = response.data;
        if (apiStats) {
          setStats({
            totalEmployees: apiStats.totalEmployees || 0,
            activeEmployees: apiStats.activeEmployees || 0,
            newThisMonth: apiStats.newThisMonth || 0,
            departmentStats: apiStats.departmentStats || [],
            employmentTypes: [
              { name: "Full Time", value: apiStats.fullTimeCount || 0 },
              { name: "Intern", value: apiStats.internCount || 0 }
            ],
            recentJoins: apiStats.recentJoins || []
          });
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
    </div>
  );

  const kpis = [
    { title: 'Total Employees', value: stats.totalEmployees, subtitle: 'in the organization', icon: Users },
    { title: 'Active', value: stats.activeEmployees, subtitle: 'currently working', icon: UserCheck },
    { title: 'New This Month', value: stats.newThisMonth, subtitle: 'recently joined', icon: UserPlus },
  ];

  const COLORS = [
    '#6366f1', '#8b5cf6', '#0ea5e9', '#ec4899',
    '#f43f5e', '#10b981', '#f59e0b', '#14b8a6',
    '#f97316', '#06b6d4',
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Page Title & Subtitle */}
      <div>
        <h1 className="text-4xl font-heading font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-[15px]">At-a-glance summary of your organization's human resources.</p>
      </div>

      {/* 2. 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-card p-6 rounded-2xl border border-border flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground font-semibold text-sm">{kpi.title}</p>
                  <h3 className="text-3xl font-heading font-bold text-white mt-1">{kpi.value}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary border border-border">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-muted-foreground text-xs font-medium">{kpi.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Headcount Bar Chart */}
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border">
          <h3 className="text-lg font-heading font-bold text-white mb-6">Headcount by Department</h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.departmentStats}
                margin={{ top: 24, right: 0, left: -20, bottom: 48 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e1e2d" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  tick={{ fill: '#8b8b9e', fontSize: 12 }}
                  angle={-35}
                  textAnchor="end"
                  dy={6}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b8b9e', fontSize: 13 }} allowDecimals={false} />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid #1e1e2d', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={36}>
                  {stats.departmentStats.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <LabelList
                    dataKey="count"
                    position="top"
                    style={{ fill: '#ffffff', fontSize: 12, fontWeight: 700 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employment Type Donut */}
        <div className="bg-card p-6 rounded-2xl border border-border">
          <h3 className="text-lg font-heading font-bold text-white mb-6">Employment Types</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.employmentTypes}
                  cx="50%"
                  cy="45%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.employmentTypes.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % 2 === 0 ? 0 : 2]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid #1e1e2d', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', color: '#8b8b9e' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Employee Table (5 rows) */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-lg font-heading font-bold text-white">Recent Joins</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 text-muted-foreground text-sm border-b border-border">
                <th className="px-6 py-4 font-medium">Employee ID</th>
                <th className="px-6 py-4 font-medium">Name & Role</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="text-[15px]">
              {(stats.recentJoins || []).slice(0, 5).map((emp: any, idx: number) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{emp.employeeCode || `EMP-${100+idx}`}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{emp.fullName}</div>
                    <div className="text-sm text-muted-foreground">{emp.role}</div>
                  </td>
                  <td className="px-6 py-4 text-white/90 capitalize">
                    {emp.team ? emp.team.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase()) : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {emp.dateOfJoining
                        ? new Date(emp.dateOfJoining).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        : '—'}
                    </span>
                  </td>
                </tr>
              ))}
              {(!stats.recentJoins || stats.recentJoins.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground italic">
                    No recent joins to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    
    </div>
  );
};

export default Dashboard;
