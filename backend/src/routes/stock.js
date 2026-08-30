const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const {
    recordStockMovement,
    getStockMovements,
    getStockStatus,
    updateProductThreshold
} = require('../controllers/stockController');

// Middleware d'authentification pour toutes les routes
router.use(authMiddleware);

// Enregistrer un mouvement de stock (Admin et Gestionnaire uniquement)
router.post('/mouvement', roleMiddleware(['Administrateur', 'Gestionnaire']), recordStockMovement);

// Obtenir l'historique des mouvements de stock
router.get('/mouvements', getStockMovements);

// Obtenir l'état actuel du stock
router.get('/etat', getStockStatus);

// Ajuster le seuil d'alerte d'un produit (Admin et Gestionnaire uniquement)
router.patch('/:id/seuil', roleMiddleware(['Administrateur', 'Gestionnaire']), updateProductThreshold);

module.exports = router;
