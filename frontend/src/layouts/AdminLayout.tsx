import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  LayoutDashboard, 
  Upload,
  Settings,
  History,
  Trash2,
  Bell,
  Search,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Bulk Upload', path: '/upload', icon: Upload },
    { name: 'Audit Logs', path: '/audit-logs', icon: History },
    { name: 'Trash Bin', path: '/trash', icon: Trash2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      
      {/* Fixed Left Sidebar */}
      <aside className="w-[280px] bg-card border-r border-border flex flex-col z-20 shrink-0 sticky top-0 h-screen">
        <div className="h-20 flex items-center px-8 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex flex-col items-center justify-center text-white font-heading font-black">H</div>
          <span className="ml-3 text-xl font-heading font-bold tracking-tight text-white">HRMS</span>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 relative">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-primary' : 'group-hover:text-white'}`} />
                <span className={`ml-4 font-semibold text-[15px] ${isActive ? 'font-bold' : ''}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-muted-foreground hover:bg-white/5 hover:text-destructive rounded-xl transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="ml-4 font-semibold text-[15px]">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border px-8 flex flex-row items-center justify-between sticky top-0 z-10 shrink-0">
          
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search employees, departments..." 
                className="w-full bg-card border border-border rounded-full py-2.5 pl-12 pr-4 text-[15px] text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6 ml-auto">
            <button className="relative text-muted-foreground hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background"></span>
            </button>
            <div className="w-px h-8 bg-border"></div>
            <Link to="/settings" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
              <div className="text-right">
                <p className="text-[14px] font-bold text-white group-hover:text-primary transition-colors">{user?.fullName || "Admin User"}</p>
                <p className="text-[12px] font-semibold text-muted-foreground tracking-wide font-heading uppercase">{user?.role || "Admin"}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-primary to-indigo-400 text-white rounded-xl flex items-center justify-center font-heading font-black text-lg">
                {(user?.fullName || "A").charAt(0)}
              </div>
            </Link>
            <div className="w-px h-6 bg-border ml-2 mr-2"></div>
            <button 
              onClick={logout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Area */}
        <section className="flex-1 p-8">
          <Outlet />
        </section>
      </main>

    </div>
  );
};

export default AdminLayout;
