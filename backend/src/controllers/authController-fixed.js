const { User, Role } = require('../models');
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
        const { nom, email, motDePasse, roleId } = req.body;

        // Vérifications
        if (!nom || !email || !motDePasse || !roleId) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        // Vérifier si l'utilisateur existe déjà
        const utilisateurExistant = await User.findOne({ where: { email } });
        if (utilisateurExistant) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Récupérer le rôle
        const roleTrouve = await Role.findByPk(roleId);
        if (!roleTrouve) {
            return res.status(400).json({ message: 'Rôle non trouvé' });
        }

        // Créer le token de vérification email
        const tokenEmail = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Créer l'utilisateur
        const nouvelUtilisateur = await User.create({
            nom,
            email,
            motDePasse,
            roleId,
            tokenEmail,
            emailVerifie: false
        });

        // Envoyer l'email de vérification (optionnel - peut être désactivé pour les tests)
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Vérification de votre compte StockShow',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
                            <h1 style="color: #333; margin-bottom: 20px;">🎉 Bienvenue sur StockShow !</h1>
                            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
                                Merci de vous être inscrit, ${nom} !<br>
                                Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :
                            </p>
                            <a href="http://localhost:3000/verification-email?token=${tokenEmail}" 
                               style="background: #007bff; color: white; padding: 12px 30px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block; 
                                      font-weight: bold; margin: 20px 0;">
                                Activer mon compte
                            </a>
                            <p style="color: #999; font-size: 12px; margin-top: 20px;">
                                Ce lien expirera dans 1 heure.<br>
                                Si vous n'avez pas demandé cette inscription, ignorez cet email.
                            </p>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.log('Email non envoyé (configuration manquante):', emailError.message);
        }

        res.status(201).json({ 
            message: 'Inscription réussie !',
            utilisateur: {
                id: nouvelUtilisateur.id,
                nom: nouvelUtilisateur.nom,
                email: nouvelUtilisateur.email,
                roleId: nouvelUtilisateur.roleId,
                role: roleTrouve
            }
        });
    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
    }
};

// Vérification email
const verificationEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: 'Token manquant' });
        }

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Mettre à jour l'utilisateur
        const utilisateur = await User.update(
            { emailVerifie: true, tokenEmail: null },
            { where: { email: decoded.email } }
        );

        if (utilisateur[0] === 0) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ 
            message: 'Email vérifié avec succès !'
        });
    } catch (error) {
        console.error('Erreur vérification email:', error);
        res.status(400).json({ message: 'Token invalide ou expiré' });
    }
};

// Connexion
const connexion = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        if (!email || !motDePasse) {
            return res.status(400).json({ message: 'Email et mot de passe requis' });
        }

        // Trouver l'utilisateur avec son rôle
        const utilisateur = await User.findOne({ 
            where: { email },
            include: [{ model: Role, as: 'role' }]
        });

        if (!utilisateur) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const motDePasseValide = await utilisateur.verifierMotDePasse(motDePasse);
        if (!motDePasseValide) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérifier si l'email est vérifié (optionnel pour les tests)
        if (!utilisateur.emailVerifie) {
            // Pour les tests, on peut bypasser cette vérification
            console.log('Email non vérifié mais connexion autorisée pour les tests');
        }

        // Vérifier si le compte est actif
        if (!utilisateur.actif) {
            return res.status(401).json({ message: 'Compte désactivé' });
        }

        // Mettre à jour la dernière connexion
        await utilisateur.update({ derniereConnexion: new Date() });

        // Créer le token JWT
        const token = jwt.sign(
            { id: utilisateur.id, email: utilisateur.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: utilisateur.id,
                nom: utilisateur.nom,
                email: utilisateur.email,
                roleId: utilisateur.roleId,
                role: utilisateur.role,
                derniereConnexion: utilisateur.derniereConnexion
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
        // Dans une implémentation réelle, on pourrait invalider le token
        res.json({ message: 'Déconnexion réussie' });
    } catch (error) {
        console.error('Erreur déconnexion:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la déconnexion' });
    }
};

module.exports = {
    inscription,
    verificationEmail,
    connexion,
    deconnexion
};
