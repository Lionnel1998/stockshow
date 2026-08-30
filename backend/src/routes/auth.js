const express = require('express');
const router = express.Router();
const { inscription, verificationEmail, connexion, deconnexion } = require('../controllers/authController');

// Route d'inscription
router.post('/inscription', inscription);

// Route de vérification email
router.get('/verification-email', verificationEmail);

// Route de connexion
router.post('/connexion', connexion);

// Route de déconnexion
router.post('/deconnexion', deconnexion);

// Route de test
router.get('/test', (req, res) => {
    res.json({ message: 'Routes d\'authentification fonctionnelles' });
});

module.exports = router;
