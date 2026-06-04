const express = require('express');
const router = express.Router();
const { Prevision } = require('../models');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Middleware d'authentification pour toutes les routes
router.use(authMiddleware);

// Obtenir toutes les prévisions
router.get('/', async (req, res) => {
    try {
        const previsions = await Prevision.findAll({
            order: [['date_debut', 'DESC']]
        });
        res.json(previsions);
    } catch (error) {
        console.error('Erreur récupération prévisions:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Obtenir une prévision par son ID
router.get('/:id', async (req, res) => {
    try {
        const prevision = await Prevision.findByPk(req.params.id);

        if (!prevision) {
            return res.status(404).json({ message: 'Prévision non trouvée' });
        }

        res.json(prevision);
    } catch (error) {
        console.error('Erreur récupération prévision:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Créer une nouvelle prévision
router.post('/', roleMiddleware(['Administrateur', 'Gestionnaire']), async (req, res) => {
    try {
        const { periode, quantitePrevue, date_debut, date_fin, methode_calcul, fiabilite, contexte_local } = req.body;

        if (!periode || !quantitePrevue) {
            return res.status(400).json({ message: 'Période et quantité prévue sont requises' });
        }

        const nouvellePrevision = await Prevision.create({
            periode,
            quantitePrevue,
            date_debut,
            date_fin,
            methode_calcul,
            fiabilite: fiabilite || 0,
            contexte_local
        });

        res.status(201).json({
            message: 'Prévision créée avec succès',
            prevision: nouvellePrevision
        });
    } catch (error) {
        console.error('Erreur création prévision:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Mettre à jour une prévision
router.put('/:id', roleMiddleware(['Administrateur', 'Gestionnaire']), async (req, res) => {
    try {
        const { id } = req.params;
        const { periode, quantitePrevue, date_debut, date_fin, methode_calcul, fiabilite, contexte_local } = req.body;

        const prevision = await Prevision.findByPk(id);
        if (!prevision) {
            return res.status(404).json({ message: 'Prévision non trouvée' });
        }

        await prevision.update({
            periode: periode || prevision.periode,
            quantitePrevue: quantitePrevue || prevision.quantitePrevue,
            date_debut: date_debut || prevision.date_debut,
            date_fin: date_fin || prevision.date_fin,
            methode_calcul: methode_calcul || prevision.methode_calcul,
            fiabilite: fiabilite !== undefined ? fiabilite : prevision.fiabilite,
            contexte_local: contexte_local !== undefined ? contexte_local : prevision.contexte_local
        });

        res.json({
            message: 'Prévision mise à jour avec succès',
            prevision
        });
    } catch (error) {
        console.error('Erreur mise à jour prévision:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer une prévision
router.delete('/:id', roleMiddleware(['Administrateur']), async (req, res) => {
    try {
        const { id } = req.params;

        const prevision = await Prevision.findByPk(id);
        if (!prevision) {
            return res.status(404).json({ message: 'Prévision non trouvée' });
        }

        await prevision.destroy();

        res.json({ message: 'Prévision supprimée avec succès' });
    } catch (error) {
        console.error('Erreur suppression prévision:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
