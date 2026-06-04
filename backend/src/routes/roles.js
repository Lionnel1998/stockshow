const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
} = require('../controllers/rolesController');

// Middleware d'authentification pour toutes les routes
router.use(authMiddleware);

// Obtenir tous les rôles
router.get('/', getAllRoles);

// Obtenir un rôle par son ID
router.get('/:id', getRoleById);

// Créer un nouveau rôle (Admin uniquement)
router.post('/', roleMiddleware(['Administrateur']), createRole);

// Mettre à jour un rôle (Admin uniquement)
router.put('/:id', roleMiddleware(['Administrateur']), updateRole);

// Supprimer un rôle (Admin uniquement)
router.delete('/:id', roleMiddleware(['Administrateur']), deleteRole);

module.exports = router;
