import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function Debts() {
  const { t } = useLanguage();
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('cash');
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
      setPayAmount('');
      fetchDebts();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.error || t('error'));
    }
  };

  const formatMoney = (n) => `TZS ${Number(n || 0).toLocaleString()}`;
  const statusColor = (s) => {
    if (s === 'paid') return 'bg-green-100 text-green-700';
    if (s === 'partial') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">{t('debts')}</h1>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${msg === t('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">{t('loading')}</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-5 py-3">{t('customer')}</th>
                <th className="text-right px-5 py-3">{t('originalAmount')}</th>
                <th className="text-right px-5 py-3">{t('remaining')}</th>
                <th className="text-center px-5 py-3">{t('status')}</th>
                <th className="text-center px-5 py-3">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {debts.length ? debts.map(d => (
                <tr key={d.id} className="border-t">
                  <td className="px-5 py-3">{d.customer_name || '-'}</td>
                  <td className="text-right px-5 py-3">{formatMoney(d.original_amount)}</td>
                  <td className="text-right px-5 py-3 font-medium text-red-accent">{formatMoney(d.remaining_amount)}</td>
                  <td className="text-center px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(d.status)}`}>
                      {t(d.status) || d.status}
                    </span>
                  </td>
                  <td className="text-center px-5 py-3">
                    {d.status !== 'paid' && (
                      <button
                        onClick={() => { setPayModal(d); setPayAmount(d.remaining_amount); }}
                        className="px-3 py-1 bg-green-primary text-white rounded-lg text-xs hover:bg-green-dark"
                      >
                        {t('pay')}
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">{t('noData')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pay Modal */}
      {payModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4">{t('payDebt')}</h2>
            <p className="text-sm text-slate-500 mb-4">
              {payModal.customer_name} – {t('remaining')}: {formatMoney(payModal.remaining_amount)}
            </p>
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('amount')}</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value)}
                  max={payModal.remaining_amount}
                  min={1}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sea-blue outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('paymentMethod')}</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sea-blue outline-none"
                >
                  <option value="cash">{t('cash')}</option>
                  <option value="mobile">{t('mobile')}</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setPayModal(null)}
                  className="flex-1 py-2 border rounded-lg">{t('cancel')}</button>
                <button type="submit"
                  className="flex-1 py-2 bg-green-primary text-white rounded-lg hover:bg-green-dark">{t('submit')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
