const express = require('express');
const router = express.Router();
const { Perte } = require('../models');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Middleware d'authentification pour toutes les routes
router.use(authMiddleware);

// Obtenir toutes les pertes
router.get('/', async (req, res) => {
    try {
        const pertes = await Perte.findAll({
            order: [['idPerte', 'DESC']]
        });
        res.json(pertes);
    } catch (error) {
        console.error('Erreur récupération pertes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Obtenir une perte par son ID
router.get('/:id', async (req, res) => {
    try {
        const perte = await Perte.findByPk(req.params.id);

        if (!perte) {
            return res.status(404).json({ message: 'Perte non trouvée' });
        }

        res.json(perte);
    } catch (error) {
        console.error('Erreur récupération perte:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Créer une nouvelle perte
router.post('/', roleMiddleware(['Administrateur', 'Gestionnaire']), async (req, res) => {
    try {
        const { cause, description } = req.body;

        if (!cause) {
            return res.status(400).json({ message: 'Cause de la perte requise' });
        }

        const nouvellePerte = await Perte.create({
            cause,
            description
        });

        res.status(201).json({
            message: 'Perte enregistrée avec succès',
            perte: nouvellePerte
        });
    } catch (error) {
        console.error('Erreur création perte:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Mettre à jour une perte
router.put('/:id', roleMiddleware(['Administrateur', 'Gestionnaire']), async (req, res) => {
    try {
        const { id } = req.params;
        const { cause, description } = req.body;

        const perte = await Perte.findByPk(id);
        if (!perte) {
            return res.status(404).json({ message: 'Perte non trouvée' });
        }

        await perte.update({
            cause: cause || perte.cause,
            description: description !== undefined ? description : perte.description
        });

        res.json({
            message: 'Perte mise à jour avec succès',
            perte
        });
    } catch (error) {
        console.error('Erreur mise à jour perte:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer une perte
router.delete('/:id', roleMiddleware(['Administrateur']), async (req, res) => {
    try {
        const { id } = req.params;

        const perte = await Perte.findByPk(id);
        if (!perte) {
            return res.status(404).json({ message: 'Perte non trouvée' });
        }

        await perte.destroy();

        res.json({ message: 'Perte supprimée avec succès' });
    } catch (error) {
        console.error('Erreur suppression perte:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
