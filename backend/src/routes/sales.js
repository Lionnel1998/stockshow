const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const {
    getAllSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale,
    getSalesStats
} = require('../controllers/salesController');

// Middleware d'authentification pour toutes les routes
router.use(authMiddleware);

// Obtenir toutes les commandes
router.get('/', getAllSales);

// Obtenir les statistiques de ventes
router.get('/stats', getSalesStats);

// Obtenir une commande par son ID
router.get('/:id', getSaleById);

// Créer une nouvelle commande (Admin et Gestionnaire uniquement)
router.post('/', roleMiddleware(['Administrateur', 'Gestionnaire']), createSale);

// Mettre à jour une commande (Admin et Gestionnaire uniquement)
router.put('/:id', roleMiddleware(['Administrateur', 'Gestionnaire']), updateSale);

// Supprimer une commande (Admin uniquement)
router.delete('/:id', roleMiddleware(['Administrateur']), deleteSale);

module.exports = router;
