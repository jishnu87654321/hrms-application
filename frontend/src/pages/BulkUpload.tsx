/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle,
  FileSpreadsheet,
  X,
  History,
  Eye,
  Table as TableIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { uploadService } from '../services/api';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Convert an Excel serial date number OR a date string into an ISO date string.
 */
const parseExcelDate = (dateVal: any): string => {
  if (!dateVal) return '';
  if (typeof dateVal === 'number') {
    // Excel serial date: days since 1899-12-30
    const d = new Date(Math.round((dateVal - 25569) * 86400 * 1000));
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  }
  const d = new Date(dateVal);
  return isNaN(d.getTime()) ? String(dateVal) : d.toISOString().split('T')[0];
};

/**
 * Normalise a raw employment-type value to a valid backend enum.
 * Prisma only has FULL_TIME | INTERN.
 */
const normalizeEmploymentType = (raw: string): string => {
  const v = String(raw || '').trim().toUpperCase().replace(/[\s\-]+/g, '_');
  const internVariants = ['INTERN', 'INTERNSHIP', 'TRAINEE', 'APPRENTICE'];
  return internVariants.includes(v) ? 'INTERN' : 'FULL_TIME';
};

/**
 * Map a single Excel row to a clean backend-compatible employee object.
 * No extra fields (_original, etc.) are included.
 * Empty strings become null for nullable fields.
 */
const mapRow = (row: any) => {
  const email     = String(row['Email'] || '').trim().toLowerCase();
  const phone     = String(row['Contact Num'] || '').trim();
  const doj       = parseExcelDate(row['DOJ']);

  return {
    employeeCode:    String(row['Emp No.'] || '').trim(),
    fullName:        String(row['Name'] || '').trim(),
    role:            String(row['Role'] || '').trim(),
    employmentType:  normalizeEmploymentType(row['Type of Employment'] || ''),
    dateOfJoining:   doj   || null,            // null if date is missing/unparseable
    team:            String(row['Team'] || '').trim(),
    phoneNumber:     phone || null,             // null if missing
    email:           email || null,             // null if missing
  };
};

// ─── Component ────────────────────────────────────────────────────────────────

const BulkUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setResult(null);
      setError(null);
      setPreviewData([]);
      setShowPreview(false);

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          // raw: false so XLSX gives us the raw cell values (numbers for dates, etc.)
          const data = XLSX.utils.sheet_to_json(ws, { raw: true });
          const mapped = (data as any[]).map(mapRow);
          setPreviewData(mapped);
          setShowPreview(true);
        } catch (err: any) {
          setError('Failed to parse Excel file. Please ensure it follows the template format.');
        }
      };
      reader.readAsBinaryString(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || previewData.length === 0) return;

    setIsUploading(true);
    setResult(null);
    setError(null);

    try {
      const resp = await uploadService.bulkUploadJson({
        employees: previewData,   // already clean — no _original field
        fileName: file.name,
      });
      setResult(resp.data);
      setFile(null);
      setPreviewData([]);
      setShowPreview(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      // Show the most useful available error message from the backend
      const data = err.response?.data;
      const msg =
        data?.error ||
        data?.message ||
        err.message ||
        'Import failed. Please check your file and try again.';
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const resp = await uploadService.downloadTemplate();
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employee_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Failed to download template');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bulk Import</h1>
        <p className="text-slate-500 font-medium">Add hundreds of employees securely using Excel (.xlsx) or CSV (.csv)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[32px] border-2 border-dashed border-slate-200 hover:border-primary/40 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer"
               onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".xlsx,.xls,.csv" 
              className="hidden" 
            />
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all mb-6">
              <Upload className="w-10 h-10 group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {file ? file.name : 'Upload Data File'}
            </h2>
            <p className="max-w-xs text-slate-500 font-medium mb-8">
              {file ? `${(file.size / 1024).toFixed(2)} KB • Click to change file` : 'Drag and drop your file here, or click to browse'}
            </p>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Template</span>
              </button>
              
              {file && previewData.length > 0 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                  disabled={isUploading}
                  className="px-8 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-xl font-extrabold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  <span>{isUploading ? 'Importing…' : `Confirm Import (${previewData.length})`}</span>
                </button>
              )}
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700">Import failed</p>
                <p className="text-xs text-red-600 mt-0.5 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Data preview */}
          {showPreview && previewData.length > 0 && !result && (
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200 overflow-hidden animate-in zoom-in-95">
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <TableIcon className="w-5 h-5 text-blue-400" />
                  Data Preview
                </h3>
                <span className="bg-blue-500/20 text-blue-200 border border-blue-500/50 px-3 py-1 rounded-full text-xs font-bold leading-none flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {previewData.length} Rows Identified
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">EMP NO</th>
                      <th className="px-6 py-4">NAME</th>
                      <th className="px-6 py-4">EMAIL</th>
                      <th className="px-6 py-4">ROLE</th>
                      <th className="px-6 py-4">TEAM</th>
                      <th className="px-6 py-4">DOJ</th>
                      <th className="px-6 py-4">TYPE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewData.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 font-semibold text-slate-800">{row.employeeCode}</td>
                        <td className="px-6 py-3 text-slate-600">{row.fullName}</td>
                        <td className="px-6 py-3 text-slate-600">{row.email}</td>
                        <td className="px-6 py-3 text-slate-600"><span className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-700 font-bold">{row.role}</span></td>
                        <td className="px-6 py-3 text-slate-600">{row.team}</td>
                        <td className="px-6 py-3 text-slate-600">{row.dateOfJoining}</td>
                        <td className="px-6 py-3 text-slate-600">{row.employmentType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {previewData.length > 5 && (
                <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                  And {previewData.length - 5} more rows…
                </div>
              )}
            </div>
          )}

          {/* Result summary */}
          {result && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200 animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800">Import Result</h3>
                  <p className="text-sm text-slate-500 font-medium">Summary of your latest upload</p>
                </div>
                <button onClick={() => setResult(null)} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-2xl font-black text-slate-800">{result.summary?.totalRows ?? 0}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Created</p>
                  <p className="text-2xl font-black text-emerald-700">{result.summary?.successCount ?? 0}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Skipped (Dup)</p>
                  <p className="text-2xl font-black text-amber-700">{result.summary?.duplicatesSkipped ?? 0}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">Failed</p>
                  <p className="text-2xl font-black text-red-700">{result.summary?.failedCount ?? 0}</p>
                </div>
              </div>

              {result.errors?.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest mb-4">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Row-Level Errors
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {result.errors.map((err: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                        <div className="bg-white px-2 py-0.5 rounded-lg border border-slate-100 text-[10px] font-black text-slate-400 mt-1">ROW {err.row}</div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-red-700">{err.error}</p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {err.data?.employeeCode || err.data?.fullName ? `${err.data.employeeCode || ''} ${err.data.fullName || ''}`.trim() : 'Unknown row'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl shadow-blue-900/20">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
              Upload Guidelines
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm font-medium text-slate-400 leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                Use the official <span className="text-blue-400 font-bold">Excel (.xlsx) Template</span> — column headers must match exactly.
              </li>
              <li className="flex gap-3 text-sm font-medium text-slate-400 leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-blue-400 font-bold">Type of Employment</span>: use <code className="text-xs bg-slate-800 px-1 rounded">FULL_TIME</code> or <code className="text-xs bg-slate-800 px-1 rounded">INTERN</code>. Others default to FULL_TIME.
              </li>
              <li className="flex gap-3 text-sm font-medium text-slate-400 leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                Rows with duplicate <span className="text-blue-400 font-bold">Email</span> or <span className="text-blue-400 font-bold">Emp No.</span> are silently skipped.
              </li>
              <li className="flex gap-3 text-sm font-medium text-slate-400 leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-blue-400 font-bold">Name</span> and <span className="text-blue-400 font-bold">Emp No.</span> are strictly required. All other fields have safe defaults.
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-[24px] border border-slate-100">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-slate-400" />
              History
            </h4>
            <p className="text-sm text-slate-500 font-medium">Previous uploads can be reviewed in the <Link to="/admin/audit-logs" className="text-primary hover:underline font-bold">Audit Logs</Link> section.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
