import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function Products() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatMoney = (n) => `TZS ${Number(n || 0).toLocaleString()}`;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{t('products')}</h1>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">{t('loading')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow p-5 border-t-4 border-green-primary">
              <h3 className="font-semibold text-lg text-slate-800">
                {lang === 'sw' ? p.name : (p.name_en || p.name)}
              </h3>
              <p className="text-xs text-slate-400 mb-3">{p.category}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('costPrice')}</span>
                  <span>{formatMoney(p.cost_price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('sellingPrice')}</span>
                  <span className="font-medium text-sea-blue">{formatMoney(p.selling_price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('stock')}</span>
                  <span className={p.stock < 10 ? 'text-red-accent font-medium' : 'text-green-primary'}>
                    {p.stock}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-slate-500">{t('profit')}</span>
                  <span className="font-medium text-green-primary">
                    {formatMoney(p.selling_price - p.cost_price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
