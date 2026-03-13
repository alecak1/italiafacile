import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, BookOpen, Users, User } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/journey', label: 'Percorso', icon: Map },
  { path: '/guides', label: 'Guide', icon: BookOpen },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/profile', label: 'Profilo', icon: User },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on onboarding and step detail
  if (location.pathname.startsWith('/onboarding') || location.pathname.startsWith('/step/')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
