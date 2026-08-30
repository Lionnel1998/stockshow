const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
} = require('../controllers/suppliersController');

// Middleware d'authentification pour toutes les routes
router.use(authMiddleware);

// Obtenir tous les fournisseurs
router.get('/', getAllSuppliers);

// Obtenir un fournisseur par son ID
router.get('/:id', getSupplierById);

// Créer un nouveau fournisseur (Admin et Gestionnaire uniquement)
router.post('/', roleMiddleware(['Administrateur', 'Gestionnaire']), createSupplier);

// Mettre à jour un fournisseur (Admin et Gestionnaire uniquement)
router.put('/:id', roleMiddleware(['Administrateur', 'Gestionnaire']), updateSupplier);

// Supprimer un fournisseur (Admin et Gestionnaire uniquement)
router.delete('/:id', roleMiddleware(['Administrateur', 'Gestionnaire']), deleteSupplier);

module.exports = router;
