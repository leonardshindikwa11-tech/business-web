import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LayoutDashboard, Package, CreditCard, LogOut, Home } from 'lucide-react';

export default function Layout({ children, customer = false }) {
  const { user, logout } = useAuth();
  const { t, lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const ownerLinks = [
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/products', label: t('products'), icon: Package },
    { to: '/debts', label: t('debts'), icon: CreditCard },
  ];

  const customerLinks = [
    { to: '/customer', label: t('myDebts'), icon: CreditCard },
  ];

  const links = customer ? customerLinks : ownerLinks;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-sea-blue text-white flex-shrink-0">
        <div className="p-5 border-b border-white/20">
          <h1 className="text-xl font-bold">{t('appName')}</h1>
          <p className="text-xs text-blue-100 mt-1">{user?.name}</p>
        </div>
        <nav className="p-3 space-y-1">
          {links.map(link => {
            const Icon = link.icon;
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active ? 'bg-white/20 font-medium' : 'hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 mt-auto border-t border-white/20 space-y-1">
          <button
            onClick={toggleLang}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-left text-sm"
          >
            🌐 {lang === 'sw' ? 'English' : 'Kiswahili'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-left text-sm"
          >
            <LogOut size={18} />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
