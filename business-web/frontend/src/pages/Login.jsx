import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t, lang, toggleLang } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.user.role === 'owner' || data.user.role === 'cashier') {
        navigate('/dashboard');
      } else {
        navigate('/customer');
      }
    } catch (err) {
      setError(err.response?.data?.error || t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-red-50 p-4">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleLang}
          className="px-4 py-2 rounded-lg bg-white shadow text-sm font-medium text-sea-blue border border-sea-blue"
        >
          {lang === 'sw' ? 'English' : 'Kiswahili'}
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-primary">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sea-blue">{t('appName')}</h1>
          <p className="text-slate-500 mt-2">{t('loginTitle')}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-accent rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sea-blue focus:border-sea-blue outline-none"
              placeholder="owner@biashara.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sea-blue focus:border-sea-blue outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-primary hover:bg-green-dark text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            {loading ? t('loading') : t('login')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {t('noAccount')}{' '}
          <Link to="/register" className="text-sea-blue font-medium hover:underline">
            {t('register')}
          </Link>
        </p>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
          <p><strong>Demo Owner:</strong> owner@biashara.com / password123</p>
          <p><strong>Demo Customer:</strong> amina@email.com / password123</p>
        </div>
      </div>
    </div>
  );
}
