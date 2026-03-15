import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, BookOpen, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navItems = [
    { path: '/dashboard', label: t('nav.home'), icon: Home },
    { path: '/journey', label: t('nav.journey'), icon: Map },
    { path: '/guides', label: t('nav.guides'), icon: BookOpen },
    { path: '/community', label: t('nav.community'), icon: Users },
  ];

  const hiddenPaths = ['/', '/auth', '/reset-password'];
  if (
    hiddenPaths.includes(location.pathname) ||
    location.pathname.startsWith('/onboarding') ||
    location.pathname.startsWith('/step/') ||
    location.pathname.startsWith('/guide/') ||
    location.pathname.startsWith('/admin')
  ) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 glass-strong safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center gap-1 px-5 py-1.5 transition-all duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isActive && (
                <span className="absolute -top-2 h-0.5 w-8 rounded-full gradient-hero" />
              )}
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
