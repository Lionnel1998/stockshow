const { Utilisateur, Role } = require('../models');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Configuration de l'email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Inscription
const inscription = async (req, res) => {
    try {
        const { nom, email, motDePasse, password, idRole, idEntreprise } = req.body;
        const plainPassword = motDePasse || password;

        // Vérifications
        if (!nom || !email || !plainPassword) {
            return res.status(400).json({ message: 'Nom, email et mot de passe sont requis' });
        }

        // Vérifier si l'utilisateur existe déjà
        const utilisateurExistant = await Utilisateur.findOne({ where: { email } });
        if (utilisateurExistant) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Récupérer le rôle ou définir un rôle par défaut
        let roleTrouve;
        if (idRole) {
            roleTrouve = await Role.findByPk(idRole);
        } else {
            roleTrouve = await Role.findOne({ where: { nomRole: 'Gestionnaire' } }) || await Role.findOne();
        }
        if (!roleTrouve) {
            return res.status(400).json({ message: 'Rôle non trouvé' });
        }

        // Récupérer l'entreprise ou utiliser la première entreprise existante
        let entrepriseTrouvee;
        if (idEntreprise) {
            entrepriseTrouvee = await Entreprise.findByPk(idEntreprise);
        } else {
            entrepriseTrouvee = await Entreprise.findOne();
        }
        if (!entrepriseTrouvee) {
            return res.status(400).json({ message: 'Entreprise non trouvée' });
        }

        // Créer l'utilisateur en attente de validation
        const nouvelUtilisateur = await Utilisateur.create({
            nom,
            email,
            motDePasse: plainPassword,
            idRole: roleTrouve.idRole,
            idEntreprise: entrepriseTrouvee.idEntreprise,
            est_actif: false,
            statut_inscription: 'en_attente'
        });

        res.status(201).json({ 
            success: true,
            message: 'Inscription enregistrée. En attente de validation par l’administrateur.',
            utilisateur: {
                idUser: nouvelUtilisateur.idUser,
                nom: nouvelUtilisateur.nom,
                email: nouvelUtilisateur.email,
                idRole: nouvelUtilisateur.idRole,
                role: roleTrouve
            }
        });
    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
    }
};

// Connexion
const connexion = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        if (!email || !motDePasse) {
            return res.status(400).json({ message: 'Email et mot de passe requis' });
        }

        // Trouver l'utilisateur avec son rôle et entreprise
        const utilisateur = await Utilisateur.findOne({ 
            where: { email },
            include: [
                { model: Role, as: 'role' }
            ]
        });

        if (!utilisateur) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const motDePasseValide = await utilisateur.verifierMotDePasse(motDePasse);
        if (!motDePasseValide) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérifier si le compte est validé
        if (utilisateur.statut_inscription === 'en_attente') {
            return res.status(403).json({ message: 'Compte en attente de validation par l’administrateur' });
        }

        if (utilisateur.statut_inscription === 'rejete') {
            return res.status(403).json({ message: 'Inscription rejetée, contactez l’administrateur' });
        }

        if (!utilisateur.est_actif) {
            return res.status(401).json({ message: 'Compte désactivé' });
        }

        // Mettre à jour la dernière connexion
        await utilisateur.update({ derniere_connexion: new Date() });

        // Créer le token JWT
        const token = jwt.sign(
            { idUser: utilisateur.idUser, email: utilisateur.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                idUser: utilisateur.idUser,
                nom: utilisateur.nom,
                email: utilisateur.email,
                idRole: utilisateur.idRole,
                role: utilisateur.role,
                derniere_connexion: utilisateur.derniere_connexion
            }
        });

    } catch (error) {
        console.error('Erreur connexion:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
    }
};

// Déconnexion
const deconnexion = async (req, res) => {
    try {
        res.json({ message: 'Déconnexion réussie' });
    } catch (error) {
        console.error('Erreur déconnexion:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la déconnexion' });
    }
};

// Vérification email (optionnel)
const verificationEmail = async (req, res) => {
    try {
        res.json({ message: 'Email vérifié avec succès !' });
    } catch (error) {
        console.error('Erreur vérification email:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    inscription,
    verificationEmail,
    connexion,
    deconnexion
};
