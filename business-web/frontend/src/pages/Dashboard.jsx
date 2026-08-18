import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [daily, setDaily] = useState(null);
  const [profits, setProfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/sales/daily'),
      api.get('/sales/profit-by-product')
    ])
      .then(([dailyRes, profitRes]) => {
        setDaily(dailyRes.data);
        setProfits(profitRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-slate-500">{t('loading')}</div>
      </Layout>
    );
  }

  const formatMoney = (n) => `TZS ${Number(n || 0).toLocaleString()}`;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{t('dashboard')}</h1>
        <p className="text-slate-500">{t('welcome')}, {user?.name}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-sea-blue">
          <p className="text-sm text-slate-500">{t('totalSales')}</p>
          <p className="text-2xl font-bold text-sea-blue">{daily?.summary?.total_sales || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-primary">
          <p className="text-sm text-slate-500">{t('totalRevenue')}</p>
          <p className="text-2xl font-bold text-green-primary">{formatMoney(daily?.summary?.total_revenue)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-red-accent">
          <p className="text-sm text-slate-500">{t('totalProfit')}</p>
          <p className="text-2xl font-bold text-red-accent">{formatMoney(daily?.summary?.total_profit)}</p>
        </div>
      </div>

      {/* Daily Sales by Product */}
      <div className="bg-white rounded-xl shadow mb-8 overflow-hidden">
        <div className="px-5 py-4 bg-sea-blue text-white font-semibold">
          {t('dailySales')} – {daily?.date}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-5 py-3">{lang === 'sw' ? 'Bidhaa' : 'Product'}</th>
                <th className="text-right px-5 py-3">{t('quantitySold')}</th>
                <th className="text-right px-5 py-3">{t('revenue')}</th>
                <th className="text-right px-5 py-3">{t('profit')}</th>
              </tr>
            </thead>
            <tbody>
              {daily?.items?.length ? daily.items.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="px-5 py-3">{lang === 'sw' ? item.name : (item.name_en || item.name)}</td>
                  <td className="text-right px-5 py-3">{item.quantity_sold}</td>
                  <td className="text-right px-5 py-3">{formatMoney(item.revenue)}</td>
                  <td className="text-right px-5 py-3 text-green-primary font-medium">{formatMoney(item.profit)}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400">{t('noData')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profit per Product */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-5 py-4 bg-green-primary text-white font-semibold">
          {t('profitPerProduct')}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-5 py-3">{lang === 'sw' ? 'Bidhaa' : 'Product'}</th>
                <th className="text-right px-5 py-3">{t('quantitySold')}</th>
                <th className="text-right px-5 py-3">{t('revenue')}</th>
                <th className="text-right px-5 py-3">{t('profit')}</th>
              </tr>
            </thead>
            <tbody>
              {profits.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-5 py-3">{lang === 'sw' ? p.name : (p.name_en || p.name)}</td>
                  <td className="text-right px-5 py-3">{p.total_sold}</td>
                  <td className="text-right px-5 py-3">{formatMoney(p.total_revenue)}</td>
                  <td className="text-right px-5 py-3 text-green-primary font-medium">{formatMoney(p.total_profit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
