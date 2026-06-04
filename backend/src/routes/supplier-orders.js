const express = require('express');
const router = express.Router();
const { CommandeFournisseur, Fournisseur } = require('../models');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Middleware d'authentification pour toutes les routes
router.use(authMiddleware);

// Obtenir toutes les commandes fournisseurs
router.get('/', async (req, res) => {
    try {
        const commandes = await CommandeFournisseur.findAll({
            include: [{ model: Fournisseur, as: 'fournisseur' }],
            order: [['dateCommande', 'DESC']]
        });
        res.json(commandes);
    } catch (error) {
        console.error('Erreur récupération commandes fournisseurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Obtenir une commande fournisseur par son ID
router.get('/:id', async (req, res) => {
    try {
        const commande = await CommandeFournisseur.findByPk(req.params.id, {
            include: [{ model: Fournisseur, as: 'fournisseur' }]
        });

        if (!commande) {
            return res.status(404).json({ message: 'Commande fournisseur non trouvée' });
        }

        res.json(commande);
    } catch (error) {
        console.error('Erreur récupération commande fournisseur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Créer une nouvelle commande fournisseur
router.post('/', roleMiddleware(['Administrateur', 'Gestionnaire']), async (req, res) => {
    try {
        const { dateCommande, idFournisseur, montant_total, date_livraison_prevue } = req.body;

        if (!dateCommande || !idFournisseur) {
            return res.status(400).json({ message: 'Date et fournisseur sont requis' });
        }

        const fournisseur = await Fournisseur.findByPk(idFournisseur);
        if (!fournisseur) {
            return res.status(400).json({ message: 'Fournisseur non trouvé' });
        }

        const nouvelleCommande = await CommandeFournisseur.create({
            dateCommande,
            idFournisseur,
            montant_total: montant_total || 0,
            date_livraison_prevue,
            statut: 'en_attente',
            numero_commande: `CF-${Date.now()}`
        });

        res.status(201).json({
            message: 'Commande fournisseur créée avec succès',
            commande: nouvelleCommande
        });
    } catch (error) {
        console.error('Erreur création commande fournisseur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Mettre à jour une commande fournisseur
router.put('/:id', roleMiddleware(['Administrateur', 'Gestionnaire']), async (req, res) => {
    try {
        const { id } = req.params;
        const { statut, date_livraison_prevue, montant_total } = req.body;

        const commande = await CommandeFournisseur.findByPk(id);
        if (!commande) {
            return res.status(404).json({ message: 'Commande fournisseur non trouvée' });
        }

        await commande.update({
            statut: statut || commande.statut,
            date_livraison_prevue: date_livraison_prevue || commande.date_livraison_prevue,
            montant_total: montant_total !== undefined ? montant_total : commande.montant_total
        });

        res.json({
            message: 'Commande fournisseur mise à jour avec succès',
            commande
        });
    } catch (error) {
        console.error('Erreur mise à jour commande fournisseur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer une commande fournisseur
router.delete('/:id', roleMiddleware(['Administrateur']), async (req, res) => {
    try {
        const { id } = req.params;

        const commande = await CommandeFournisseur.findByPk(id);
        if (!commande) {
            return res.status(404).json({ message: 'Commande fournisseur non trouvée' });
        }

        await commande.destroy();

        res.json({ message: 'Commande fournisseur supprimée avec succès' });
    } catch (error) {
        console.error('Erreur suppression commande fournisseur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
