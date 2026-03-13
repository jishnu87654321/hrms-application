"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      animate={{
        backgroundPosition: ["200% 0", "-200% 0"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
      className={cn(
        "rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
        className
      )}
    />
  );
}

export function KPICardSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-xl">
      <Skeleton className="h-6 w-32 mb-6" />
      <div className="flex items-end justify-between gap-2 h-[250px]">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${Math.random() * 60 + 40}%` }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Skeleton className="w-8 h-full rounded-t-lg" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function EmployeeCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-xl">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-6 w-20 rounded-full mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-border"
    >
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </motion.tr>
  );
}

export function AuditLogSkeleton() {
  return (
    <div className="flex gap-4 p-4">
      <div className="flex flex-col items-center">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-16 w-0.5 mt-2" />
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export function UploadZoneSkeleton() {
  return (
    <div className="p-12 rounded-2xl border-2 border-dashed border-border bg-card/30">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}
