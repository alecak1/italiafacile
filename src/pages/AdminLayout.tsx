import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { Map, Footprints, BookOpen, Users, Shield, ArrowLeft } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin/corridors', label: 'Corridoi', icon: Map },
  { to: '/admin/steps', label: 'Steps', icon: Footprints },
  { to: '/admin/guides', label: 'Guide', icon: BookOpen },
  { to: '/admin/community', label: 'Community', icon: Users },
];

const AdminLayout = () => {
  const { isAdmin, loading } = useAdmin();
  const { loading: authLoading } = useAuth();

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-5xl flex items-center gap-4 px-4 py-3">
          <NavLink to="/dashboard" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </NavLink>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-lg font-black tracking-tight text-foreground">Admin</span>
          </div>
          <div className="flex gap-1 ml-4 overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                    isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  }`
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-5xl p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
