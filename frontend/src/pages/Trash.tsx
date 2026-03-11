import React, { useEffect, useState } from 'react';
import { 
  Trash2, 
  RotateCcw, 
  Search, 
  AlertCircle,
  Trash
} from 'lucide-react';
import { employeeService } from '../services/api';

const TrashPage: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const resp = await employeeService.getTrash();
      setEmployees(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (id: string) => {
    if (window.confirm('Restore this employee record?')) {
      try {
        await employeeService.restore(id);
        fetchTrash();
      } catch (err) {
        alert('Failed to restore');
      }
    }
  };

  const filtered = employees.filter(e => e.fullName.toLowerCase().includes(search.toLowerCase()) || e.employeeCode.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Trash2 className="w-8 h-8 text-red-500" />
          Trash Bin
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl leading-relaxed mt-1">Deleted employees are stored here. You can restore them within 30 days before permanent deletion from our PostgreSQL cluster.</p>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200">
        <div className="relative group max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter trash..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center animate-pulse">
            <Trash className="w-10 h-10 text-slate-100 mx-auto mb-2 animate-bounce transition-all duration-700" />
            <p className="text-slate-300 font-bold tracking-widest uppercase text-xs">Scanning Trash Partition...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-28 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
            <Trash className="w-16 h-16 text-slate-100 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-500">Trash is empty</h3>
            <p className="text-slate-400 font-medium mt-1">Great! No active deletions pending.</p>
          </div>
        ) : (
          filtered.map((emp) => (
            <div key={emp.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200 group hover:shadow-xl hover:shadow-slate-200/50 hover:scale-[1.02] transition-all relative overflow-hidden ring-1 ring-slate-100 hover:ring-primary/20">
               <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-800 text-white rounded-2xl flex items-center justify-center font-black shadow-lg">
                    {emp.fullName.charAt(0)}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-tighter text-slate-300 mb-0.5">Reference ID</p>
                    <p className="text-xs font-mono font-bold text-slate-800">{emp.employeeCode}</p>
                  </div>
               </div>
               
               <div className="mb-6">
                  <h4 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors">{emp.fullName}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{emp.role} • {emp.team || 'Unassigned'}</p>
               </div>

               <div className="flex items-center gap-2 mb-6 text-red-500 bg-red-50/50 w-fit px-3 py-1 rounded-full border border-red-100">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Marked for Deletion</span>
               </div>

               <button
                  onClick={() => handleRestore(emp.id)}
                  className="w-full py-3.5 bg-slate-50 hover:bg-emerald-500 hover:text-white text-slate-700 rounded-2xl font-black transition-all border border-slate-100 hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2 group-btn"
               >
                  <RotateCcw className="w-4 h-4" />
                  RESTORE RECORD
               </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrashPage;
