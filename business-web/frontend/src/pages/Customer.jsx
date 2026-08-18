import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function Customer() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('mobile');
  const [msg, setMsg] = useState('');

  const fetchDebts = () => {
    api.get('/debts')
      .then(res => setDebts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDebts(); }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/debts/${payModal.id}/pay`, {
        amount: Number(payAmount),
        payment_method: payMethod
      });
      setMsg(t('success'));
      setPayModal(null);
      fetchDebts();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.error || t('error'));
    }
  };

  const formatMoney = (n) => `TZS ${Number(n || 0).toLocaleString()}`;

  return (
    <Layout customer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{t('customerPortal')}</h1>
        <p className="text-slate-500">{t('welcome')}, {user?.name}</p>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${msg === t('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg}
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-5 py-4 bg-red-accent text-white font-semibold">{t('myDebts')}</div>
        {loading ? (
          <div className="p-8 text-center text-slate-500">{t('loading')}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-5 py-3">{t('originalAmount')}</th>
                <th className="text-right px-5 py-3">{t('remaining')}</th>
                <th className="text-center px-5 py-3">{t('status')}</th>
                <th className="text-center px-5 py-3">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {debts.length ? debts.map(d => (
                <tr key={d.id} className="border-t">
                  <td className="px-5 py-3">{formatMoney(d.original_amount)}</td>
                  <td className="text-right px-5 py-3 font-medium text-red-accent">{formatMoney(d.remaining_amount)}</td>
                  <td className="text-center px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${d.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {t(d.status) || d.status}
                    </span>
                  </td>
                  <td className="text-center px-5 py-3">
                    {d.status !== 'paid' && (
                      <button
                        onClick={() => { setPayModal(d); setPayAmount(d.remaining_amount); }}
                        className="px-3 py-1 bg-green-primary text-white rounded-lg text-xs"
                      >
                        {t('payDebt')}
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400">{t('noData')}</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {payModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">{t('payDebt')}</h2>
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">{t('amount')}</label>
                <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)}
                  max={payModal.remaining_amount} min={1} required
                  className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm mb-1">{t('paymentMethod')}</label>
                <select value={payMethod} onChange={e => setPayMethod(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg">
                  <option value="mobile">{t('mobile')}</option>
                  <option value="cash">{t('cash')}</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setPayModal(null)} className="flex-1 py-2 border rounded-lg">{t('cancel')}</button>
                <button type="submit" className="flex-1 py-2 bg-green-primary text-white rounded-lg">{t('submit')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
