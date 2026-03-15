import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { profile } = useProfile();

  const hiddenPaths = ['/', '/auth', '/reset-password', '/profile'];
  if (
    hiddenPaths.includes(location.pathname) ||
    location.pathname.startsWith('/onboarding') ||
    location.pathname.startsWith('/guide/') ||
    location.pathname.startsWith('/step/') ||
    location.pathname.startsWith('/admin') ||
    !user
  ) {
    return null;
  }

  const userName = profile?.name || user?.user_metadata?.full_name || 'U';
  const avatarUrl = profile?.avatar_url;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 pt-3 pb-2">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 transition-all hover:opacity-80 active:scale-95"
        aria-label="Home"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-hero">
          <MapPin className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-extrabold text-foreground tracking-tight">Trasferisciti</span>
      </button>
      <button
        onClick={() => navigate('/profile')}
        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border/60 bg-card shadow-card overflow-hidden transition-all hover:shadow-card-hover hover:scale-105 active:scale-95"
        aria-label="Profilo"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm font-black text-primary">
            {userName.charAt(0).toUpperCase()}
          </span>
        )}
      </button>
    </div>
  );
};

export default AppHeader;
