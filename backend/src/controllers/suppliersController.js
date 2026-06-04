const { Fournisseur } = require('../models');

// Obtenir tous les fournisseurs
const getAllSuppliers = async (req, res) => {
    try {
        const fournisseurs = await Fournisseur.findAll({
            order: [['nom', 'ASC']]
        });
        res.json(fournisseurs);
    } catch (error) {
        console.error('Erreur récupération fournisseurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir un fournisseur par son ID
const getSupplierById = async (req, res) => {
    try {
        const fournisseur = await Fournisseur.findByPk(req.params.id);

        if (!fournisseur) {
            return res.status(404).json({ message: 'Fournisseur non trouvé' });
        }

        res.json(fournisseur);
    } catch (error) {
        console.error('Erreur récupération fournisseur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Créer un nouveau fournisseur
const createSupplier = async (req, res) => {
    try {
        const { nom, email, telephone, adresse, site_web } = req.body;

        // Validation
        if (!nom) {
            return res.status(400).json({ message: 'Nom du fournisseur requis' });
        }

        // Créer le fournisseur
        const nouveauFournisseur = await Fournisseur.create({
            nom,
            email,
            telephone,
            adresse,
            site_web
        });

        res.status(201).json({
            message: 'Fournisseur créé avec succès',
            fournisseur: nouveauFournisseur
        });
    } catch (error) {
        console.error('Erreur création fournisseur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour un fournisseur
const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, email, telephone, adresse, site_web } = req.body;

        const fournisseur = await Fournisseur.findByPk(id);
        if (!fournisseur) {
            return res.status(404).json({ message: 'Fournisseur non trouvé' });
        }

        // Mettre à jour le fournisseur
        await fournisseur.update({
            nom: nom || fournisseur.nom,
            email: email !== undefined ? email : fournisseur.email,
            telephone: telephone !== undefined ? telephone : fournisseur.telephone,
            adresse: adresse !== undefined ? adresse : fournisseur.adresse,
            site_web: site_web !== undefined ? site_web : fournisseur.site_web
        });

        res.json({
            message: 'Fournisseur mis à jour avec succès',
            fournisseur
        });
    } catch (error) {
        console.error('Erreur mise à jour fournisseur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer un fournisseur
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        const fournisseur = await Fournisseur.findByPk(id);
        if (!fournisseur) {
            return res.status(404).json({ message: 'Fournisseur non trouvé' });
        }

        await fournisseur.destroy();

        res.json({ message: 'Fournisseur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression fournisseur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
