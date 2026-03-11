import React, { useEffect, useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Download,
  AlertCircle,
  Loader2,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { employeeService, dashboardService } from '../services/api';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);
  const navigate = useNavigate();

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    type: '',
    departmentId: '',
    page: 1,
    limit: 10
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getAll(filters);
      setEmployees(response.data.employees);
      setMeta(response.data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDepts = async () => {
      const resp = await dashboardService.getDepartments();
      setDepartments(resp.data);
    };
    fetchDepts();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee? This is a soft delete.')) {
      try {
        await employeeService.delete(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete employee');
      }
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Employee Directory</h1>
          <p className="text-slate-500 font-medium">Manage and view all employee records</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/employees/add" className="px-5 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </Link>
          <button className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filter Stats / Summary */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name, ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
            />
          </div>
          <select
            name="departmentId"
            value={filters.departmentId}
            onChange={handleFilterChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium appearance-none"
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium appearance-none"
          >
            <option value="">All Roles</option>
            <option value="Engineer">Engineer</option>
            <option value="Manager">Manager</option>
            <option value="Lead">Lead</option>
            <option value="Intern">Intern</option>
          </select>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium appearance-none"
          >
            <option value="">All Types</option>
            <option value="FULL_TIME">Full-time</option>
            <option value="INTERN">Intern</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee ID & Team</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contacts (Email/Phone)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">DOJ (Joining Date)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-slate-400 font-medium">Fetching records...</p>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <AlertCircle className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-500 font-bold text-lg">No employees found</p>
                    <p className="text-slate-400 text-sm">Try adjusting your filters or search terms</p>
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold border border-slate-100 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                          {emp.fullName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-bold text-slate-900">{emp.fullName}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                            emp.employmentType === 'FULL_TIME' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {emp.employmentType.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-800">{emp.employeeCode}</p>
                      <p className="text-xs text-slate-500 font-medium">{emp.role} • {emp.department?.name}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-slate-700">{emp.email}</p>
                      <p className="text-xs text-slate-500">{emp.phoneNumber}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-600 font-semibold">{new Date(emp.dateOfJoining).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => navigate(`/employees/edit/${emp.id}`)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(emp.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{((meta.page - 1) * meta.limit) + 1}</span> to <span className="font-bold text-slate-900">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-bold text-slate-900">{meta.total}</span> entries
          </p>
          <div className="flex items-center space-x-2">
            <button
              disabled={meta.page === 1}
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-100 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1">
              {[...Array(meta.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    meta.page === i + 1 ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={meta.page === meta.totalPages}
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-100 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
