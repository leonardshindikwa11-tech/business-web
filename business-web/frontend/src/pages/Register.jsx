import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t, lang, toggleLang } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...form, role: 'customer', language: lang });
      navigate('/customer');
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

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border-t-4 border-sea-blue">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sea-blue">{t('appName')}</h1>
          <p className="text-slate-500 mt-2">{t('registerTitle')}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-accent rounded-lg text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('name')}</label>
            <input name="name" value={form.name} onChange={handleChange} required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sea-blue outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('email')}</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sea-blue outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('phone')}</label>
            <input name="phone" value={form.phone} onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sea-blue outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('password')}</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sea-blue outline-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-sea-blue hover:bg-sea-blue-dark text-white font-semibold rounded-lg transition disabled:opacity-50">
            {loading ? t('loading') : t('register')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {t('alreadyHaveAccount')}{' '}
          <Link to="/login" className="text-green-primary font-medium hover:underline">{t('login')}</Link>
        </p>
      </div>
    </div>
  );
}
