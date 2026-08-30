const { Produit, Categorie, Fournisseur, Entreprise } = require('../models');

// Obtenir tous les produits
const getAllProducts = async (req, res) => {
    try {
        const produits = await Produit.findAll({
            include: [
                { model: Categorie, as: 'categorie', attributes: ['idCategorie', 'nomCategorie'] },
                { model: Fournisseur, as: 'fournisseur', attributes: ['idFournisseur', 'nom'] },
                { model: Entreprise, as: 'entreprise', attributes: ['idEntreprise', 'nom'] }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(produits);
    } catch (error) {
        console.error('Erreur récupération produits:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir un produit par son ID
const getProductById = async (req, res) => {
    try {
        const produit = await Produit.findByPk(req.params.id, {
            include: [
                { model: Categorie, as: 'categorie' },
                { model: Fournisseur, as: 'fournisseur' },
                { model: Entreprise, as: 'entreprise' }
            ]
        });

        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        res.json(produit);
    } catch (error) {
        console.error('Erreur récupération produit:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Créer un nouveau produit
const createProduct = async (req, res) => {
    try {
        const { nom, description, prixVente, prixAchat, stockActuel, seuilAlerte, code_barre, idCategorie, idFournisseur, idEntreprise, image } = req.body;

        // Validation
        if (!nom || !prixVente || !prixAchat || !idEntreprise) {
            return res.status(400).json({ message: 'Nom, prix de vente, prix d\'achat et entreprise sont requis' });
        }

        // Vérifier si la catégorie existe
        if (idCategorie) {
            const categorie = await Categorie.findByPk(idCategorie);
            if (!categorie) {
                return res.status(400).json({ message: 'Catégorie non trouvée' });
            }
        }

        // Vérifier si le fournisseur existe
        if (idFournisseur) {
            const fournisseur = await Fournisseur.findByPk(idFournisseur);
            if (!fournisseur) {
                return res.status(400).json({ message: 'Fournisseur non trouvé' });
            }
        }

        // Vérifier si l'entreprise existe
        const entreprise = await Entreprise.findByPk(idEntreprise);
        if (!entreprise) {
            return res.status(400).json({ message: 'Entreprise non trouvée' });
        }

        // Vérifier si le code barre existe déjà
        if (code_barre) {
            const existingCodeBarre = await Produit.findOne({ where: { code_barre } });
            if (existingCodeBarre) {
                return res.status(400).json({ message: 'Ce code barre est déjà utilisé' });
            }
        }

        // Créer le produit
        const nouveauProduit = await Produit.create({
            nom,
            description,
            prixVente,
            prixAchat,
            stockActuel: stockActuel || 0,
            seuilAlerte: seuilAlerte || 10,
            code_barre,
            idCategorie,
            idFournisseur,
            idEntreprise,
            image,
            est_actif: true
        });

        // Récupérer le produit créé avec ses associations
        const produitComplet = await Produit.findByPk(nouveauProduit.idProduit, {
            include: [
                { model: Categorie, as: 'categorie' },
                { model: Fournisseur, as: 'fournisseur' },
                { model: Entreprise, as: 'entreprise' }
            ]
        });

        res.status(201).json({
            message: 'Produit créé avec succès',
            produit: produitComplet
        });
    } catch (error) {
        console.error('Erreur création produit:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour un produit
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, description, prixVente, prixAchat, stockActuel, seuilAlerte, code_barre, idCategorie, idFournisseur, idEntreprise, image, est_actif } = req.body;

        const produit = await Produit.findByPk(id);
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        // Vérifier si la catégorie existe
        if (idCategorie && idCategorie !== produit.idCategorie) {
            const categorie = await Categorie.findByPk(idCategorie);
            if (!categorie) {
                return res.status(400).json({ message: 'Catégorie non trouvée' });
            }
        }

        // Vérifier si le fournisseur existe
        if (idFournisseur && idFournisseur !== produit.idFournisseur) {
            const fournisseur = await Fournisseur.findByPk(idFournisseur);
            if (!fournisseur) {
                return res.status(400).json({ message: 'Fournisseur non trouvé' });
            }
        }

        // Vérifier si l'entreprise existe
        if (idEntreprise && idEntreprise !== produit.idEntreprise) {
            const entreprise = await Entreprise.findByPk(idEntreprise);
            if (!entreprise) {
                return res.status(400).json({ message: 'Entreprise non trouvée' });
            }
        }

        // Vérifier si le code barre existe déjà (si modifié)
        if (code_barre && code_barre !== produit.code_barre) {
            const existingCodeBarre = await Produit.findOne({ where: { code_barre } });
            if (existingCodeBarre) {
                return res.status(400).json({ message: 'Ce code barre est déjà utilisé' });
            }
        }

        // Mettre à jour le produit
        await produit.update({
            nom: nom || produit.nom,
            description: description !== undefined ? description : produit.description,
            prixVente: prixVente || produit.prixVente,
            prixAchat: prixAchat || produit.prixAchat,
            stockActuel: stockActiel !== undefined ? stockActuel : produit.stockActuel,
            seuilAlerte: seuilAlerte !== undefined ? seuilAlerte : produit.seuilAlerte,
            code_barre: code_barre || produit.code_barre,
            idCategorie: idCategorie || produit.idCategorie,
            idFournisseur: idFournisseur || produit.idFournisseur,
            idEntreprise: idEntreprise || produit.idEntreprise,
            image: image !== undefined ? image : produit.image,
            est_actif: est_actif !== undefined ? est_actif : produit.est_actif
        });

        // Récupérer le produit mis à jour avec ses associations
        const produitMisAJour = await Produit.findByPk(id, {
            include: [
                { model: Categorie, as: 'categorie' },
                { model: Fournisseur, as: 'fournisseur' },
                { model: Entreprise, as: 'entreprise' }
            ]
        });

        res.json({
            message: 'Produit mis à jour avec succès',
            produit: produitMisAJour
        });
    } catch (error) {
        console.error('Erreur mise à jour produit:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer un produit
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const produit = await Produit.findByPk(id);
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        await produit.destroy();

        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression produit:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour le stock d'un produit
const updateProductStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        const produit = await Produit.findByPk(id);
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        await produit.update({ stockActuel: stock });

        res.json({
            message: 'Stock mis à jour avec succès',
            stockActuel: produit.stockActuel
        });
    } catch (error) {
        console.error('Erreur mise à jour stock:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Vérifier les alertes de stock
const checkStockAlerts = async (req, res) => {
    try {
        const produits = await Produit.findAll({
            where: {
                est_actif: true
            }
        });

        const alertes = produits.filter(produit => {
            return produit.stockActuel <= produit.seuilAlerte;
        }).map(produit => ({
            idProduit: produit.idProduit,
            nom: produit.nom,
            stockActuel: produit.stockActuel,
            seuilAlerte: produit.seuilAlerte,
            difference: produit.seuilAlerte - produit.stockActuel
        }));

        res.json({
            total: alertes.length,
            alertes
        });
    } catch (error) {
        console.error('Erreur vérification alertes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    checkStockAlerts
};
