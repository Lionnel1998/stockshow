const express = require('express');
const router = express.Router();
const { RecommandationAchat } = require('../models');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Middleware d'authentification pour toutes les routes
router.use(authMiddleware);

// Obtenir toutes les recommandations
router.get('/', async (req, res) => {
    try {
        const recommandations = await RecommandationAchat.findAll({
            order: [['date_recommandation', 'DESC']]
        });
        res.json(recommandations);
    } catch (error) {
        console.error('Erreur récupération recommandations:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Obtenir une recommandation par son ID
router.get('/:id', async (req, res) => {
    try {
        const recommandation = await RecommandationAchat.findByPk(req.params.id);

        if (!recommandation) {
            return res.status(404).json({ message: 'Recommandation non trouvée' });
        }

        res.json(recommandation);
    } catch (error) {
        console.error('Erreur récupération recommandation:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Créer une nouvelle recommandation
router.post('/', roleMiddleware(['Administrateur', 'Gestionnaire']), async (req, res) => {
    try {
        const { date_recommandation, quantite_conseillee, date_limite_commande, justification, statut } = req.body;

        if (!date_recommandation || !quantite_conseillee) {
            return res.status(400).json({ message: 'Date de recommandation et quantité conseillée sont requises' });
        }

        const nouvelleRecommandation = await RecommandationAchat.create({
            date_recommandation,
            quantite_conseillee,
            date_limite_commande,
            justification,
            statut: statut || 'a_faire'
        });

        res.status(201).json({
            message: 'Recommandation créée avec succès',
            recommandation: nouvelleRecommandation
        });
    } catch (error) {
        console.error('Erreur création recommandation:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Mettre à jour une recommandation
router.put('/:id', roleMiddleware(['Administrateur', 'Gestionnaire']), async (req, res) => {
    try {
        const { id } = req.params;
        const { date_recommandation, quantite_conseillee, date_limite_commande, justification, statut } = req.body;

        const recommandation = await RecommandationAchat.findByPk(id);
        if (!recommandation) {
            return res.status(404).json({ message: 'Recommandation non trouvée' });
        }

        await recommandation.update({
            date_recommandation: date_recommandation || recommandation.date_recommandation,
            quantite_conseillee: quantite_conseillee || recommandation.quantite_conseillee,
            date_limite_commande: date_limite_commande || recommandation.date_limite_commande,
            justification: justification !== undefined ? justification : recommandation.justification,
            statut: statut || recommandation.statut
        });

        res.json({
            message: 'Recommandation mise à jour avec succès',
            recommandation
        });
    } catch (error) {
        console.error('Erreur mise à jour recommandation:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer une recommandation
router.delete('/:id', roleMiddleware(['Administrateur']), async (req, res) => {
    try {
        const { id } = req.params;

        const recommandation = await RecommandationAchat.findByPk(id);
        if (!recommandation) {
            return res.status(404).json({ message: 'Recommandation non trouvée' });
        }

        await recommandation.destroy();

        res.json({ message: 'Recommandation supprimée avec succès' });
    } catch (error) {
        console.error('Erreur suppression recommandation:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
