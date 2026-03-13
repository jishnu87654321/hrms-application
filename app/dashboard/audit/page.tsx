"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  UserPlus, 
  UserMinus, 
  Edit, 
  Upload, 
  Download, 
  Lock, 
  Shield,
  Filter,
  Calendar,
  ChevronDown
} from "lucide-react";
import { AuditLogSkeleton } from "@/components/dashboard/loading-skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  action: string;
  actionType: "create" | "update" | "delete" | "upload" | "download" | "auth" | "security";
  user: string;
  target?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

const actionIcons = {
  create: UserPlus,
  update: Edit,
  delete: UserMinus,
  upload: Upload,
  download: Download,
  auth: Lock,
  security: Shield,
};

const actionColors = {
  create: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  update: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  delete: "bg-red-500/20 text-red-400 border-red-500/30",
  upload: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  download: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  auth: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  security: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

// Mock audit logs
const mockLogs: AuditLog[] = [
  { id: "1", action: "Employee Created", actionType: "create", user: "Admin", target: "John Smith", details: "New employee added to Engineering department", timestamp: "2024-01-15 14:32:00", ipAddress: "192.168.1.100" },
  { id: "2", action: "Bulk Upload", actionType: "upload", user: "HR Manager", details: "CSV file uploaded with 45 new records", timestamp: "2024-01-15 13:45:00", ipAddress: "192.168.1.101" },
  { id: "3", action: "Employee Updated", actionType: "update", user: "Admin", target: "Sarah Johnson", details: "Position changed to Senior Developer", timestamp: "2024-01-15 11:20:00", ipAddress: "192.168.1.100" },
  { id: "4", action: "Login Success", actionType: "auth", user: "Admin", details: "Successful authentication via email/password", timestamp: "2024-01-15 09:00:00", ipAddress: "192.168.1.100" },
  { id: "5", action: "Employee Deleted", actionType: "delete", user: "Admin", target: "Mike Wilson", details: "Employee record removed from system", timestamp: "2024-01-14 16:30:00", ipAddress: "192.168.1.100" },
  { id: "6", action: "Report Downloaded", actionType: "download", user: "Finance Manager", details: "Q4 2023 payroll report exported", timestamp: "2024-01-14 15:15:00", ipAddress: "192.168.1.102" },
  { id: "7", action: "Permission Changed", actionType: "security", user: "Super Admin", target: "HR Manager", details: "Added bulk upload permission", timestamp: "2024-01-14 10:45:00", ipAddress: "192.168.1.99" },
  { id: "8", action: "Employee Created", actionType: "create", user: "HR Manager", target: "Emily Davis", details: "New employee added to Marketing department", timestamp: "2024-01-13 14:00:00", ipAddress: "192.168.1.101" },
  { id: "9", action: "Failed Login Attempt", actionType: "auth", user: "unknown@test.com", details: "Invalid password - attempt 3/5", timestamp: "2024-01-13 08:30:00", ipAddress: "203.0.113.50" },
  { id: "10", action: "Security Alert", actionType: "security", user: "System", details: "Multiple failed login attempts detected from IP 203.0.113.50", timestamp: "2024-01-13 08:35:00" },
];

const actionFilters = ["All", "create", "update", "delete", "upload", "download", "auth", "security"];

export default function AuditLogsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filter, setFilter] = useState("All");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs(mockLogs);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredLogs = filter === "All" 
    ? logs 
    : logs.filter(log => log.actionType === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">Track all system activities</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 bg-secondary border-border">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {actionFilters.map((action) => (
                <SelectItem key={action} value={action} className="capitalize">
                  {action === "All" ? "All Actions" : action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="border-border">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        {/* Animated timeline line */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-indigo-500 via-violet-500 to-transparent"
        />

        <div className="space-y-4">
          {isLoading ? (
            [...Array(5)].map((_, i) => <AuditLogSkeleton key={i} />)
          ) : (
            filteredLogs.map((log, index) => {
              const Icon = actionIcons[log.actionType];
              const isExpanded = expandedLog === log.id;

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex gap-4"
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0",
                      actionColors[log.actionType]
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    whileHover={{ scale: 1.01, x: 5 }}
                    onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                    className={cn(
                      "flex-1 p-4 rounded-xl border cursor-pointer transition-all duration-300",
                      "bg-card/30 backdrop-blur-xl hover:bg-card/50",
                      isExpanded ? "border-indigo-500/50" : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{log.action}</h3>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                            actionColors[log.actionType]
                          )}>
                            {log.actionType}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          by <span className="text-foreground">{log.user}</span>
                          {log.target && (
                            <> on <span className="text-foreground">{log.target}</span></>
                          )}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{log.timestamp}</span>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Expanded details */}
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: isExpanded ? "auto" : 0,
                        opacity: isExpanded ? 1 : 0
                      }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                        {log.ipAddress && (
                          <p className="text-xs text-muted-foreground">
                            IP Address: <code className="bg-secondary px-1 py-0.5 rounded">{log.ipAddress}</code>
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Load more */}
        {!isLoading && filteredLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-8"
          >
            <Button variant="outline" className="border-border">
              Load More Logs
            </Button>
          </motion.div>
        )}

        {/* Empty state */}
        {!isLoading && filteredLogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No logs found</h3>
            <p className="text-muted-foreground">
              No audit logs match your current filter.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
