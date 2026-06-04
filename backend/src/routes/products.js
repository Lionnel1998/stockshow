const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    checkStockAlerts
} = require('../controllers/productsController');

// Middleware d'authentification pour toutes les routes
router.use(authMiddleware);

// Obtenir tous les produits
router.get('/', getAllProducts);

// Vérifier les alertes de stock
router.get('/alerts/check', checkStockAlerts);

// Obtenir un produit par son ID
router.get('/:id', getProductById);

// Créer un nouveau produit (Admin et Gestionnaire uniquement)
router.post('/', roleMiddleware(['Administrateur', 'Gestionnaire']), createProduct);

// Mettre à jour un produit (Admin et Gestionnaire uniquement)
router.put('/:id', roleMiddleware(['Administrateur', 'Gestionnaire']), updateProduct);

// Mettre à jour le stock d'un produit (Admin et Gestionnaire uniquement)
router.patch('/:id/stock', roleMiddleware(['Administrateur', 'Gestionnaire']), updateProductStock);

// Supprimer un produit (Admin uniquement)
router.delete('/:id', roleMiddleware(['Administrateur']), deleteProduct);

module.exports = router;
