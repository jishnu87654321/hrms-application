"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MoreVertical, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  location?: string;
  avatar?: string;
  status: "active" | "inactive" | "on-leave";
}

interface EmployeeCardProps {
  employee: Employee;
  index: number;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
}

const statusColors = {
  active: "bg-emerald-500",
  inactive: "bg-gray-500",
  "on-leave": "bg-amber-500"
};

export function EmployeeCard({ employee, index, onEdit, onDelete }: EmployeeCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`
          : "perspective(1000px) rotateY(0deg) rotateX(0deg)",
        transition: "transform 0.1s ease-out"
      }}
      className="relative group"
    >
      <div
        className={cn(
          "p-6 rounded-2xl backdrop-blur-xl border border-border/50 bg-card/50",
          "transition-all duration-300",
          isHovered && "border-indigo-500/50 shadow-2xl shadow-indigo-500/10"
        )}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Avatar with glow ring */}
              <motion.div
                animate={isHovered ? {
                  boxShadow: [
                    "0 0 0 0 rgba(99, 102, 241, 0)",
                    "0 0 0 8px rgba(99, 102, 241, 0.3)",
                    "0 0 0 0 rgba(99, 102, 241, 0)"
                  ]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                  {employee.name.charAt(0)}
                </div>
                <div className={cn(
                  "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card",
                  statusColors[employee.status]
                )} />
              </motion.div>
              
              <div>
                <h3 className="font-semibold text-foreground">{employee.name}</h3>
                <p className="text-sm text-muted-foreground">{employee.position}</p>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem onClick={() => onEdit?.(employee)}>
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(employee)}
                  className="text-red-400 focus:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Department badge */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-medium mb-4"
          >
            {employee.department}
          </motion.div>
          
          {/* Contact info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span className="truncate">{employee.email}</span>
            </div>
            {employee.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{employee.phone}</span>
              </div>
            )}
            {employee.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{employee.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
