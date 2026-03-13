import React, { useEffect, useState } from 'react';
import { History, Activity, Clock } from 'lucide-react';
import { dashboardService } from '../services/api';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const resp = await dashboardService.getAuditLogs();
        setLogs(resp.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionStyle = (action: string) => {
    switch (action) {
      case 'CREATE':      return 'bg-emerald-100 text-emerald-700';
      case 'UPDATE':      return 'bg-blue-100 text-blue-700';
      case 'DELETE':      return 'bg-red-100 text-red-700';
      case 'BULK_UPLOAD': return 'bg-amber-100 text-amber-700';
      default:            return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Page header — no PostgreSQL Live button */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Audit Logs</h1>
        <p className="text-slate-500 font-medium">Detailed history of all actions performed in the system</p>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">User Account</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Entity &amp; ID</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center animate-pulse">
                    <Activity className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-400 font-bold">Parsing system logs…</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <History className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-slate-500">No logs found</h3>
                    <p className="text-slate-400 font-medium max-w-xs mx-auto mt-1 leading-relaxed">
                      System activity will appear here once users start performing actions.
                    </p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">

                    {/* User Account */}
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-black border border-slate-100 group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                          {log.user?.fullName?.charAt(0) || 'S'}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-bold text-slate-900 leading-tight">{log.user?.fullName || 'System'}</p>
                          <p className="text-xs text-slate-400 font-medium">{log.user?.role || 'Service'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Action badge */}
                    <td className="px-8 py-6 text-sm">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getActionStyle(log.action)}`}>
                        {log.action}
                      </span>
                    </td>

                    {/* Entity & ID */}
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-800">{log.entity}</p>
                      <p className="text-[10px] text-slate-400 font-medium font-mono uppercase truncate max-w-[160px]">
                        {log.entityId || '—'}
                      </p>
                    </td>

                    {/* Timestamp */}
                    <td className="px-8 py-6">
                      <div className="flex items-center text-slate-500">
                        <Clock className="w-3.5 h-3.5 mr-2 opacity-40" />
                        <span className="text-sm font-semibold">
                          {new Date(log.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
