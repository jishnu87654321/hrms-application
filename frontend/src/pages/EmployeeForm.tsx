import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Save, 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  Hash,
  Mail,
  Phone,
  Briefcase,
  Layers,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { employeeService } from '../services/api';

const employeeSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.string().min(2, 'Role is required'),
  employmentType: z.enum(['FULL_TIME', 'INTERN']),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  employeeCode: z.string().min(3, 'Employee code is required'),
  dateOfJoining: z.string().min(1, 'Joining date is required'),
  team: z.string().min(2, 'Team is required'),
});

type EmployeeForm = z.infer<typeof employeeSchema>;

const EmployeeFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [initialLoading, setInitialLoading] = useState(isEdit);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employmentType: 'FULL_TIME',
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {

        if (isEdit && id) {
          const empResp = await employeeService.getById(id);
          const emp = empResp.data;
          setValue('fullName', emp.fullName);
          setValue('role', emp.role);
          setValue('employmentType', emp.employmentType);
          setValue('phoneNumber', emp.phoneNumber);
          setValue('email', emp.email);
          setValue('employeeCode', emp.employeeCode);
          setValue('dateOfJoining', new Date(emp.dateOfJoining).toISOString().split('T')[0]);
          setValue('team', emp.team || 'OTHER');
        }
      } catch {
        setError('Failed to load data.');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit, setValue]);

  const onSubmit = async (data: EmployeeForm) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isEdit && id) {
        await employeeService.update(id, data);
      } else {
        await employeeService.create(data);
      }
      navigate('/employees');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save employee.');
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoading) return <div className="p-8 text-center text-slate-500 font-bold">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/employees" className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isEdit ? 'Update Details' : 'New Colleague'}
            </h1>
            <p className="text-slate-500 font-medium">
              {isEdit ? `Modifying profile for record #${id?.slice(-4)}` : 'Fill in the information to add a person'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 animate-shake font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-10 space-y-10">
          {/* Section 1: Personal */}
          <div>
            <div className="flex items-center gap-2 mb-6 bg-slate-50 w-fit px-4 py-1 rounded-full border border-slate-100">
              <UserIcon className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personal Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input {...register('fullName')} placeholder="Alice Johnson" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-800" />
                </div>
                {errors.fullName && <p className="text-xs text-red-500 font-medium ml-1">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input {...register('email')} placeholder="alice@company.com" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-800" />
                </div>
                {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input {...register('phoneNumber')} placeholder="+1 234 567 890" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-800" />
                </div>
                {errors.phoneNumber && <p className="text-xs text-red-500 font-medium ml-1">{errors.phoneNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Employee ID / Code</label>
                <div className="relative group">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input {...register('employeeCode')} placeholder="EMP-1024" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-800" />
                </div>
                {errors.employeeCode && <p className="text-xs text-red-500 font-medium ml-1">{errors.employeeCode.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Professional */}
          <div>
            <div className="flex items-center gap-2 mb-6 bg-slate-50 w-fit px-4 py-1 rounded-full border border-slate-100">
              <Briefcase className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Professional Details</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Team / Department</label>
                <div className="relative group">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" />
                  <select {...register('team')} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-800 appearance-none">
                    <option value="">Select Team</option>
                    {['ENGINEERING', 'HR', 'MARKETING', 'SALES', 'FINANCE', 'OPERATIONS', 'DESIGN', 'SUPPORT', 'PRODUCT', 'SPECIFIC', 'SOLID', 'SOPS', 'STUDENT_RELATED_BUS', 'OTHER'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                {errors.team && <p className="text-xs text-red-500 font-medium ml-1">{errors.team.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Designation / Role</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input {...register('role')} placeholder="Frontend Developer" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-800" />
                </div>
                {errors.role && <p className="text-xs text-red-500 font-medium ml-1">{errors.role.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Employment Type</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" />
                  <select {...register('employmentType')} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-800 appearance-none">
                    <option value="FULL_TIME">Full-time</option>
                    <option value="INTERN">Intern</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Date of Joining (DOJ)</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input {...register('dateOfJoining')} type="date" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-800" />
                </div>
                {errors.dateOfJoining && <p className="text-xs text-red-500 font-medium ml-1">{errors.dateOfJoining.message}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-4">
          <Link to="/employees" className="px-6 py-3 font-bold text-slate-600 hover:text-slate-900 transition-colors">Cancel</Link>
          <button
            disabled={isLoading}
            type="submit"
            className="px-10 py-3.5 bg-primary hover:bg-blue-700 text-white rounded-2xl font-extrabold shadow-lg shadow-primary/30 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-70 disabled:scale-100"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <Save className="w-5 h-5" />
                <span>{isEdit ? 'Update Profile' : 'Create Record'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeFormPage;
