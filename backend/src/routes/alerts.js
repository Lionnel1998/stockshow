const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const {
    getAllAlerts,
    getAlertById,
    markAlertAsRead,
    markAlertAsResolved,
    markAllAlertsAsRead,
    getAlertsStats,
    deleteAlert
} = require('../controllers/alertsController');

// Middleware d'authentification pour toutes les routes
router.use(authMiddleware);

// Obtenir toutes les alertes
router.get('/', getAllAlerts);

// Obtenir les alertes non lues
router.get('/unread', (req, res) => {
    req.query.lue = 'false';
    getAllAlerts(req, res);
});

// Obtenir les statistiques des alertes
router.get('/stats', getAlertsStats);

// Obtenir une alerte par son ID
router.get('/:id', getAlertById);

// Marquer une alerte comme lue
router.patch('/:id/read', markAlertAsRead);

// Marquer toutes les alertes comme lues
router.patch('/read-all', markAllAlertsAsRead);

// Traiter une alerte (Admin et Gestionnaire uniquement)
router.patch('/:id/treat', roleMiddleware(['Administrateur', 'Gestionnaire']), markAlertAsResolved);

// Supprimer une alerte (Admin uniquement)
router.delete('/:id', roleMiddleware(['Administrateur']), deleteAlert);

module.exports = router;
