const jwt = require('jsonwebtoken');
const { Utilisateur, Role } = require('../models');

// Middleware d'authentification
const authMiddleware = async (req, res, next) => {
    try {
        // Vérifier si le token existe dans les headers
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Accès refusé - Token manquant' });
        }

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Récupérer l'utilisateur avec son rôle
        const utilisateur = await Utilisateur.findOne({ 
            where: { idUser: decoded.idUser },
            include: [{ model: Role, as: 'role' }]
        });
        
        if (!utilisateur) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier si l'utilisateur est actif
        if (!utilisateur.est_actif) {
            return res.status(401).json({ message: 'Compte désactivé' });
        }

        // Ajouter l'utilisateur à la requête
        req.user = utilisateur;
        next();
    } catch (error) {
        console.error('Erreur auth middleware:', error);
        res.status(401).json({ message: 'Token invalide' });
    }
};

// Middleware de vérification des rôles
const roleMiddleware = (rolesPermis) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentification requise' });
        }

        const niveauAcces = req.user.role ? req.user.role.niveau_acces : 0;
        const roleActuel = req.user.role ? req.user.role.nomRole : '';

        // Vérifier si le rôle actuel est dans les rôles permis
        if (rolesPermis.includes(roleActuel)) {
            return next();
        }

        // Vérification par niveau d'accès (alternative)
        if (niveauAcces >= 3) {
            // Administrateur - accès complet
            return next();
        } else if (niveauAcces >= 2 && niveauAcces < 3) {
            // Gérant - accès partiel
            const rolesGerant = ['Gérant'];
            if (rolesGerant.includes(roleActuel)) {
                return next();
            }
        } else if (niveauAcces >= 1 && niveauAcces < 2) {
            // Gestionnaire - accès limité
            const rolesGestionnaire = ['Gestionnaire'];
            if (rolesGestionnaire.includes(roleActuel)) {
                return next();
            }
        }

        res.status(403).json({ message: 'Permissions insuffisantes' });
    };
};

module.exports = { authMiddleware, roleMiddleware };
