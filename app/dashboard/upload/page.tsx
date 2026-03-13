"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Upload, File, CheckCircle, XCircle, FileSpreadsheet, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UploadResult {
  id: string;
  fileName: string;
  status: "success" | "error";
  recordsProcessed?: number;
  errors?: string[];
  uploadedAt: string;
}

// Mock upload history
const mockHistory: UploadResult[] = [
  { id: "1", fileName: "employees_jan_2024.csv", status: "success", recordsProcessed: 45, uploadedAt: "2024-01-15" },
  { id: "2", fileName: "contractors_q1.csv", status: "success", recordsProcessed: 12, uploadedAt: "2024-01-10" },
  { id: "3", fileName: "new_hires_dec.csv", status: "error", errors: ["Invalid email format on row 5"], uploadedAt: "2024-01-05" },
];

export default function BulkUploadPage() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [history] = useState<UploadResult[]>(mockHistory);
  const [confetti, setConfetti] = useState<{ x: number; y: number; id: number }[]>([]);

  const triggerConfetti = useCallback(() => {
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      id: Date.now() + i,
    }));
    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 2000);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);
    setUploadResult(null);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          setUploadResult({
            id: Date.now().toString(),
            fileName: file.name,
            status: "success",
            recordsProcessed: Math.floor(Math.random() * 50) + 10,
            uploadedAt: new Date().toISOString().split("T")[0],
          });
          triggerConfetti();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  }, [triggerConfetti]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls", ".xlsx"],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Bulk Upload</h1>
        <p className="text-muted-foreground mt-1">Import employees via CSV file</p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        {/* Confetti */}
        <AnimatePresence>
          {confetti.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ 
                opacity: 1, 
                scale: 0,
                x: "50%",
                y: "50%",
                rotate: 0
              }}
              animate={{
                opacity: 0,
                scale: 1,
                x: `${particle.x}%`,
                y: `${particle.y + 100}%`,
                rotate: Math.random() * 360,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute w-3 h-3 rounded-full pointer-events-none"
              style={{
                backgroundColor: ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"][
                  Math.floor(Math.random() * 5)
                ],
              }}
            />
          ))}
        </AnimatePresence>

        <motion.div
          {...getRootProps()}
          animate={{
            scale: isDragActive ? 1.02 : 1,
            borderColor: isDragActive ? "#6366f1" : "#374151",
          }}
          whileHover={{ scale: 1.01 }}
          className={`
            relative p-12 rounded-2xl border-2 border-dashed cursor-pointer
            bg-card/30 backdrop-blur-xl transition-all duration-300
            ${isDragActive ? "border-indigo-500 bg-indigo-500/10" : "border-border hover:border-indigo-500/50"}
          `}
        >
          <input {...getInputProps()} />
          
          {/* Animated border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: isDragActive
                ? "linear-gradient(90deg, transparent 50%, rgba(99, 102, 241, 0.3) 50%)"
                : "transparent",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="flex flex-col items-center justify-center text-center relative z-10">
            <motion.div
              animate={isDragActive ? { 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{ duration: 0.5, repeat: isDragActive ? Infinity : 0 }}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center mb-6
                ${isDragActive ? "bg-indigo-500/20" : "bg-secondary"}
              `}
            >
              <Upload className={`w-10 h-10 ${isDragActive ? "text-indigo-400" : "text-muted-foreground"}`} />
            </motion.div>
            
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {isDragActive ? "Drop your file here" : "Drag & drop your CSV file"}
            </h3>
            <p className="text-muted-foreground mb-4">
              or click to browse from your computer
            </p>
            <p className="text-sm text-muted-foreground">
              Supports: CSV, XLS, XLSX (max 10MB)
            </p>
          </div>
        </motion.div>

        {/* Progress */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FileSpreadsheet className="w-8 h-8 text-indigo-400" />
                </motion.div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Uploading file...</p>
                  <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
                </div>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Result */}
        <AnimatePresence>
          {uploadComplete && uploadResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20 }}
              className="mt-6 p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-xl"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center"
                >
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    Upload Successful
                    <motion.span
                      animate={{ rotate: [0, 20, -20, 0] }}
                      transition={{ duration: 0.5, repeat: 3 }}
                    >
                      <Sparkles className="w-5 h-5 text-amber-400" />
                    </motion.span>
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {uploadResult.recordsProcessed} records have been processed successfully.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="border-emerald-500/30 hover:bg-emerald-500/10">
                      View Records
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setUploadComplete(false)}>
                      Upload Another
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Download Template */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/30"
      >
        <div className="flex items-center gap-3">
          <File className="w-5 h-5 text-indigo-400" />
          <div>
            <p className="font-medium text-foreground">CSV Template</p>
            <p className="text-sm text-muted-foreground">Download our template for correct formatting</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </motion.div>

      {/* Upload History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-foreground">Upload History</h2>
        
        <div className="space-y-3">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.01, x: 5 }}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${item.status === "success" ? "bg-emerald-500/20" : "bg-red-500/20"}
                `}>
                  {item.status === "success" ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.status === "success" 
                      ? `${item.recordsProcessed} records processed`
                      : item.errors?.[0]
                    }
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{item.uploadedAt}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
