import React, { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Key,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Activity,
  Terminal,
  Server
} from 'lucide-react';
import { adminService } from '../services/api';

const SettingsPage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    phoneNumber: '',
    officeAddress: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const resp = await adminService.getProfile();
      setProfile(resp.data);
      setFormData({
        phoneNumber: resp.data.adminDetail?.phoneNumber || '',
        officeAddress: resp.data.adminDetail?.officeAddress || '',
      });
    } catch (err: any) {
      setError('Failed to load profile details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await adminService.updateProfile(formData);
      setSuccess('Profile updated successfully.');
      fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-heading font-bold text-white tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground text-[15px]">Manage your administrative profile, security preferences, and system access.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Admin Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-3xl border border-border overflow-hidden p-8 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black mb-6">
                {profile?.fullName.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-card flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1">{profile?.fullName}</h2>
            <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/20 mb-6">
              {profile?.role} Access
            </div>

            <div className="w-full space-y-4 pt-6 border-t border-border mt-2 text-left">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground truncate w-full">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{profile?.adminDetail?.phoneNumber || 'No phone set'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Last Login IP</span>
                  <span className="text-xs font-mono text-white">{profile?.adminDetail?.lastLoginIp || '127.0.0.1'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-3xl border border-white/5 p-6 space-y-4">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Key className="w-3.5 h-3.5" />
              Permissions Granted
            </h3>
            <div className="flex flex-wrap gap-2">
              {(profile?.adminDetail?.permissions || ['MANAGE_EMPLOYEES', 'VIEW_LOGS']).map((perm: string) => (
                <span key={perm} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-white border border-white/10 uppercase tracking-wide">
                  {perm.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Tabs/Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl flex items-center gap-3 animate-shake font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 font-medium">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              {success}
            </div>
          )}

          <div className="bg-card rounded-3xl border border-border overflow-hidden">
            <div className="p-8 border-b border-border bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Profile Details</h3>
                  <p className="text-sm text-muted-foreground font-medium">Your public metadata and contact coordinates.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1 uppercase tracking-wider">Full Name (System Only)</label>
                  <div className="relative group grayscale">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input value={profile?.fullName} disabled className="w-full pl-11 pr-4 py-3.5 bg-background border border-border/50 rounded-2xl cursor-not-allowed opacity-50 font-medium text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1 uppercase tracking-wider">Admin Contact Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      value={formData.phoneNumber} 
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      placeholder="+1 (555) 000-0000" 
                      className="w-full pl-11 pr-4 py-3.5 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-white placeholder:text-muted-foreground" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground ml-1 uppercase tracking-wider">Office / Base Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    value={formData.officeAddress} 
                    onChange={(e) => setFormData({...formData, officeAddress: e.target.value})}
                    placeholder="Floor 4, Silicon Plaza, SV Road" 
                    className="w-full pl-11 pr-4 py-3.5 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/10 transition-all font-medium text-white placeholder:text-muted-foreground" 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-card rounded-3xl border border-border p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="font-bold text-white mb-1">API Keys</h4>
                   <p className="text-xs text-muted-foreground font-medium mb-3">Rotate or generate new production keys for external integrations.</p>
                   <button className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline">Manage Access Tags</button>
                </div>
             </div>

             <div className="bg-card rounded-3xl border border-border p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="font-bold text-white mb-1">System Health</h4>
                   <p className="text-xs text-muted-foreground font-medium mb-3">View infrastructure uptime and database connection latency.</p>
                   <button className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline">View Diagnostics</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
