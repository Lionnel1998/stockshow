import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, ArrowUpRight, Loader2, AlertTriangle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AssistantIA = () => {
  const [question, setQuestion] = useState('Quel produit doit être commandé en priorité ?');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [products, setProducts] = useState([
    { nom: 'Chaussures Nike', stock: 85, seuil: 20 },
    { nom: 'Sac à main cuir', stock: 12, seuil: 15 },
    { nom: 'T-shirt coton', stock: 3, seuil: 10 },
    { nom: 'Montre classique', stock: 28, seuil: 8 }
  ]);
  const [alerts, setAlerts] = useState([]);
  const [result, setResult] = useState({
    summary: 'L’IA analyse le stock actuel pour détecter les risques de rupture et les opportunités d’achat.',
    recommendations: [
      { title: 'T-shirt coton : commander 25 unités', reason: 'Stock actuel très bas par rapport au seuil de sécurité.' },
      { title: 'Sac à main cuir : commander 15 unités', reason: 'Stock faible et demande saisonnière attendue.' }
    ],
    source: 'local-fallback',
    model: 'analyse-statique'
  });
  // Charger les données des produits et alertes au démarrage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Récupérer les produits
        const productsRes = await fetch(`${API_BASE_URL}/products`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }).catch(() => null);
        
        if (productsRes?.ok) {
          const data = await productsRes.json();
          if (Array.isArray(data)) {
            setProducts(data.slice(0, 10).map(p => ({
              nom: p.nom || p.name || 'Produit',
              stock: p.stock || p.stockActuel || 0,
              seuil: p.seuilAlerte || p.seuil || 10
            })));
          }
        }

        // Récupérer les alertes
        const alertsRes = await fetch(`${API_BASE_URL}/alerts`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }).catch(() => null);
        
        if (alertsRes?.ok) {
          const data = await alertsRes.json();
          if (Array.isArray(data)) {
            setAlerts(data.slice(0, 5));
          }
        }
      } catch (error) {
        console.log("Utilisation des données d'exemple");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const criticalProducts = products.filter(p => p.stock <= p.seuil);
  const criticalCount = criticalProducts.length;
  const totalProducts = products.length;
  const healthPercentage = totalProducts > 0 ? Math.round((1 - criticalCount / totalProducts) * 100) : 100;
  const handleAnalyze = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          question,
          products: products.map(p => ({ 
            nom: p.nom, 
            stockActuel: p.stock, 
            seuilAlerte: p.seuil 
          })),
          alerts: alerts.slice(0, 3)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur IA');
      }

      setResult({
        summary: data.summary || 'Analyse complète effectuée.',
        recommendations: data.recommendations || [],
        source: data.source || 'openai',
        model: data.model || 'ia'
      });
    } catch (error) {
      setResult({
        summary: 'Le service IA n’est pas disponible pour le moment. Le système est revenu au mode d’analyse locale.',
        recommendations: criticalProducts.length 
          ? criticalProducts.slice(0, 3).map(p => ({
              title: `${p.nom} : commander ${Math.max(10, p.seuil - p.stock + 20)} unités`,
              reason: `Stock actuel ${p.stock} / seuil ${p.seuil}. Risque de rupture.`
            }))
          : [{ title: 'Stock stable', reason: 'Aucun risque de rupture détecté.' }],
        source: 'local-fallback',
        model: 'analyse-statique'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assistant IA</h1>
          <p className="text-gray-600">Analyse intelligente du stock et des recommandations d’achat</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 text-violet-700 px-3 py-2 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          Mode IA
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-violet-100 p-2 rounded-xl text-violet-700">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Question à l’IA</h2>
          </div>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Demandez une analyse de stock, une prédiction, ou une recommandation..."
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={loading || loadingData}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
              {loading ? 'Analyse...' : 'Lancer l\'analyse'}
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-600 to-violet-500 text-white rounded-2xl p-5 shadow-sm">
          <div className="text-sm uppercase tracking-wide text-violet-100">État du système</div>
          <div className="mt-4 text-3xl font-bold">{result.source === 'openai' ? 'IA active' : 'Analyse locale'}</div>
          <div className="mt-2 text-sm text-violet-100">Modèle : {result.model}</div>
          <div className="mt-4 pt-4 border-t border-violet-400">
            <div className="text-xs text-violet-100 mb-2">Santé du stock</div>
            <div className="text-2xl font-bold">{healthPercentage}%</div>
            <div className="mt-1 text-xs text-violet-100">{criticalCount} produit(s) critique(s)</div>
          </div>
        </div>
      </div>

      {/* Produits critiques */}
      {criticalProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-900">Produits à surveiller</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {criticalProducts.slice(0, 4).map((p, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-amber-100">
                <div className="font-medium text-gray-900 text-sm">{p.nom}</div>
                <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
                  <span>Stock: {p.stock} / Seuil: {p.seuil}</span>
                  <span className="font-semibold text-amber-600">{Math.round((p.stock / p.seuil) * 100)}%</span>
                </div>
                <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500" 
                    style={{ width: `${Math.min((p.stock / p.seuil) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Résultat d'analyse</h3>
        <p className="text-gray-700 leading-7">{result.summary}</p>

        <div className="mt-6 space-y-3">
          {result.recommendations.length > 0 ? (
            result.recommendations.map((item, index) => (
              <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                <div className="mt-1 text-sm text-gray-600">{item.reason}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              Aucune recommandation pour le moment
            </div>
          )}
        </div>
      </div>

      {/* Données chargées */}
      {!loadingData && (
        <div className="text-xs text-gray-500 text-center">
          {products.length} produit(s) chargé(s) • {alerts.length} alerte(s) active(s)
        </div>
      )}
    </div>
  );
};

export default AssistantIA;
