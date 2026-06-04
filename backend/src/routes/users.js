const express = require('express');
const router = express.Router();
const { Utilisateur, Role, Entreprise } = require('../models');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Route publique pour mise à jour du statut d'inscription (utilisée par le frontend de démonstration)
router.patch('/public/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { statut_inscription } = req.body;
        const allowedStatuts = ['en_attente', 'actif', 'rejete'];

        if (!statut_inscription || !allowedStatuts.includes(statut_inscription)) {
            return res.status(400).json({ message: 'Statut d\'inscription invalide' });
        }

        const utilisateur = await Utilisateur.findByPk(id);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const est_actif = statut_inscription === 'actif';
        await utilisateur.update({ statut_inscription, est_actif });

        res.json({
            success: true,
            message: `Statut d'inscription mis à jour : ${statut_inscription}`,
            utilisateur
        });
    } catch (error) {
        console.error('Erreur mise à jour statut public utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Middleware d'authentification pour toutes les routes
router.use(authMiddleware);

// Obtenir tous les utilisateurs (Admin uniquement)
router.get('/', roleMiddleware(['Administrateur']), async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.findAll({
            include: [
                { model: Role, as: 'role', attributes: ['nomRole', 'niveau_acces'] },
                { model: Entreprise, as: 'entreprise', attributes: ['nom'] }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(utilisateurs);
    } catch (error) {
        console.error('Erreur récupération utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Créer un utilisateur (Admin uniquement)
router.post('/', roleMiddleware(['Administrateur']), async (req, res) => {
    try {
        const { nom, email, motDePasse, idRole, idEntreprise } = req.body;

        // Validation
        if (!nom || !email || !motDePasse || !idRole || !idEntreprise) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        // Vérifier si l'email existe déjà
        const utilisateurExistant = await Utilisateur.findOne({ where: { email } });
        if (utilisateurExistant) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Vérifier si le rôle existe
        const role = await Role.findByPk(idRole);
        if (!role) {
            return res.status(400).json({ message: 'Rôle non trouvé' });
        }

        // Vérifier si l'entreprise existe
        const entreprise = await Entreprise.findByPk(idEntreprise);
        if (!entreprise) {
            return res.status(400).json({ message: 'Entreprise non trouvée' });
        }

        // Créer l'utilisateur
        const nouvelUtilisateur = await Utilisateur.create({
            nom,
            email,
            motDePasse,
            idRole,
            idEntreprise,
            est_actif: true,
            statut_inscription: 'actif'
        });

        // Récupérer l'utilisateur avec son rôle et entreprise
        const utilisateurComplet = await Utilisateur.findByPk(nouvelUtilisateur.idUser, {
            include: [
                { model: Role, as: 'role' },
                { model: Entreprise, as: 'entreprise' }
            ]
        });

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            utilisateur: utilisateurComplet
        });
    } catch (error) {
        console.error('Erreur création utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Mettre à jour un utilisateur (Admin uniquement)
router.put('/:id', roleMiddleware(['Administrateur']), async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, email, idRole, idEntreprise, est_actif, statut_inscription } = req.body;

        const utilisateur = await Utilisateur.findByPk(id);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Si l'email est modifié, vérifier qu'il n'existe pas déjà
        if (email && email !== utilisateur.email) {
            const emailExistant = await Utilisateur.findOne({ where: { email } });
            if (emailExistant) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé' });
            }
        }

        // Si le rôle est modifié, vérifier qu'il existe
        if (idRole && idRole !== utilisateur.idRole) {
            const role = await Role.findByPk(idRole);
            if (!role) {
                return res.status(400).json({ message: 'Rôle non trouvé' });
            }
        }

        // Si l'entreprise est modifiée, vérifier qu'elle existe
        if (idEntreprise && idEntreprise !== utilisateur.idEntreprise) {
            const entreprise = await Entreprise.findByPk(idEntreprise);
            if (!entreprise) {
                return res.status(400).json({ message: 'Entreprise non trouvée' });
            }
        }

        const allowedStatuts = ['en_attente', 'actif', 'rejete'];
        if (statut_inscription !== undefined && !allowedStatuts.includes(statut_inscription)) {
            return res.status(400).json({ message: 'Statut d\'inscription invalide' });
        }

        let nouveauEstActif = utilisateur.est_actif;
        if (statut_inscription !== undefined) {
            nouveauEstActif = statut_inscription === 'actif';
        } else if (est_actif !== undefined) {
            nouveauEstActif = est_actif;
        }

        const updates = {
            nom: nom || utilisateur.nom,
            email: email || utilisateur.email,
            idRole: idRole || utilisateur.idRole,
            idEntreprise: idEntreprise || utilisateur.idEntreprise,
            est_actif: nouveauEstActif
        };

        if (statut_inscription !== undefined) {
            updates.statut_inscription = statut_inscription;
        }

        await utilisateur.update(updates);

        // Récupérer l'utilisateur mis à jour avec son rôle et entreprise
        const utilisateurMisAJour = await Utilisateur.findByPk(id, {
            include: [
                { model: Role, as: 'role' },
                { model: Entreprise, as: 'entreprise' }
            ]
        });

        res.json({
            message: 'Utilisateur mis à jour avec succès',
            utilisateur: utilisateurMisAJour
        });
    } catch (error) {
        console.error('Erreur mise à jour utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer un utilisateur (Admin uniquement)
router.delete('/:id', roleMiddleware(['Administrateur']), async (req, res) => {
    try {
        const { id } = req.params;

        // Empêcher la suppression de soi-même
        if (parseInt(id) === req.user.idUser) {
            return res.status(403).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
        }

        const utilisateur = await Utilisateur.findByPk(id);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        await utilisateur.destroy();

        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Activer/Désactiver un utilisateur (Admin uniquement)
router.patch('/:id/toggle', roleMiddleware(['Administrateur']), async (req, res) => {
    try {
        const { id } = req.params;

        // Empêcher la désactivation de soi-même
        if (parseInt(id) === req.user.idUser) {
            return res.status(403).json({ message: 'Vous ne pouvez pas désactiver votre propre compte' });
        }

        const utilisateur = await Utilisateur.findByPk(id);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Inverser le statut actif
        const nouvelEtatActif = !utilisateur.est_actif;
        await utilisateur.update({ est_actif: nouvelEtatActif });

        res.json({
            message: `Utilisateur ${nouvelEtatActif ? 'activé' : 'désactivé'} avec succès`,
            est_actif: nouvelEtatActif
        });
    } catch (error) {
        console.error('Erreur toggle utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Mettre à jour le statut d'inscription (validation / rejet) par l'admin
router.patch('/:id/status', roleMiddleware(['Administrateur']), async (req, res) => {
    try {
        const { id } = req.params;
        const { statut_inscription } = req.body;
        const allowedStatuts = ['en_attente', 'actif', 'rejete'];

        if (!statut_inscription || !allowedStatuts.includes(statut_inscription)) {
            return res.status(400).json({ message: 'Statut d\'inscription invalide' });
        }

        const utilisateur = await Utilisateur.findByPk(id);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const est_actif = statut_inscription === 'actif';
        await utilisateur.update({ statut_inscription, est_actif });

        res.json({
            message: `Statut d'inscription mis à jour : ${statut_inscription}`,
            utilisateur
        });
    } catch (error) {
        console.error('Erreur mise à jour statut utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Obtenir les informations de l'utilisateur connecté
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findByPk(req.user.idUser, {
            include: [
                { model: Role, as: 'role' },
                { model: Entreprise, as: 'entreprise' }
            ],
            attributes: { exclude: ['motDePasse'] }
        });

        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json(utilisateur);
    } catch (error) {
        console.error('Erreur profil utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
