const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

const buildFallbackAnalysis = (payload = {}) => {
  const products = Array.isArray(payload.products) ? payload.products : [];
  const alerts = Array.isArray(payload.alerts) ? payload.alerts : [];
  const question = payload.question || 'Analyse globale du stock';

  const criticalProducts = products
    .filter((p) => Number(p.stockActuel ?? p.stock ?? 0) <= Number(p.seuilAlerte ?? p.seuil ?? 0))
    .sort((a, b) => {
      const stockA = Number(a.stockActuel ?? a.stock ?? 0);
      const stockB = Number(b.stockActuel ?? b.stock ?? 0);
      const seuilA = Number(a.seuilAlerte ?? a.seuil ?? 1);
      const seuilB = Number(b.seuilAlerte ?? b.seuil ?? 1);
      return (stockA / Math.max(seuilA, 1)) - (stockB / Math.max(seuilB, 1));
    })
    .slice(0, 5);

  const recommendations = criticalProducts.length
    ? criticalProducts.map((p) => {
        const name = p.nom || p.name || 'Produit';
        const stock = Number(p.stockActuel ?? p.stock ?? 0);
        const seuil = Number(p.seuilAlerte ?? p.seuil ?? 0);
        const suggestedQty = Math.max(10, seuil - stock + 20);
        return {
          title: `${name} : commander ${suggestedQty} unités`,
          reason: `Stock actuel ${stock} / seuil ${seuil}. Risque de rupture si la demande continue.`
        };
      })
    : [
        {
          title: 'Aucune rupture immédiate détectée',
          reason: 'Le stock global reste stable. Continuez les contrôles hebdomadaires.'
        }
      ];

  const summary = criticalProducts.length
    ? `L'analyse indique un risque de stock sur ${criticalProducts.length} produit(s) prioritaires. ${question}. Il est recommandé d'anticiper les commandes sur les produits les plus critiques.`
    : `Aucun risque majeur n'est détecté sur les produits actuels. La situation est stable et la demande semble maîtrisée.`;

  return {
    summary,
    recommendations: recommendations.slice(0, 3),
    alerts: alerts.slice(0, 3),
    source: 'local-fallback',
    model: 'analyse-statique'
  };
};

const callOpenAI = async (payload) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant IA pour une PME de gestion de stock. Donne des conseils clairs, actionnables, en français, basés sur les données de stock et de ventes.'
        },
        {
          role: 'user',
          content: JSON.stringify(payload, null, 2)
        }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI error: ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Réponse IA vide');
  }

  return {
    summary: content,
    recommendations: [
      {
        title: 'Analyse générée par l’IA',
        reason: 'Réponse issue du modèle OpenAI.'
      }
    ],
    source: 'openai',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
  };
};

router.post('/analyze', async (req, res) => {
  try {
    const payload = {
      question: req.body?.question || 'Analyse globale du stock',
      products: req.body?.products || [],
      alerts: req.body?.alerts || [],
      sales: req.body?.sales || []
    };

    try {
      const openAiResponse = await callOpenAI(payload);
      if (openAiResponse) {
        return res.json(openAiResponse);
      }
    } catch (error) {
      console.warn('OpenAI indisponible, utilisation du fallback local:', error.message);
    }

    const fallback = buildFallbackAnalysis(payload);
    return res.json(fallback);
  } catch (error) {
    console.error('Erreur IA analyze:', error);
    return res.status(500).json({ message: 'Erreur lors de l’analyse IA', error: error.message });
  }
});

module.exports = router;
