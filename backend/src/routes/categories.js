const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoriesController');

// Middleware d'authentification pour toutes les routes
router.use(authMiddleware);

// Obtenir toutes les catégories
router.get('/', getAllCategories);

// Obtenir une catégorie par son ID
router.get('/:id', getCategoryById);

// Créer une nouvelle catégorie (Admin et Gestionnaire uniquement)
router.post('/', roleMiddleware(['Administrateur', 'Gestionnaire']), createCategory);

// Mettre à jour une catégorie (Admin et Gestionnaire uniquement)
router.put('/:id', roleMiddleware(['Administrateur', 'Gestionnaire']), updateCategory);

// Supprimer une catégorie (Admin et Gestionnaire uniquement)
router.delete('/:id', roleMiddleware(['Administrateur', 'Gestionnaire']), deleteCategory);

module.exports = router;
