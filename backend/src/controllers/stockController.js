const { MouvementStock, Produit, Utilisateur } = require('../models');

// Enregistrer un mouvement de stock
const recordStockMovement = async (req, res) => {
    try {
        const { idProduit, quantite, type, raison, idUtilisateur } = req.body;

        // Validation
        if (!idProduit || !quantite || !type) {
            return res.status(400).json({ message: 'Produit, quantité et type sont requis' });
        }

        if (!['ENTREE', 'SORTIE'].includes(type)) {
            return res.status(400).json({ message: 'Type doit être ENTREE ou SORTIE' });
        }

        // Vérifier si le produit existe
        const produit = await Produit.findByPk(idProduit);
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        // Vérifier si le stock est suffisant pour une sortie
        if (type === 'SORTIE' && produit.stockActuel < quantite) {
            return res.status(400).json({ 
                message: `Stock insuffisant. Disponible: ${produit.stockActuel}, Demandé: ${quantite}` 
            });
        }

        // Créer le mouvement de stock
        const mouvement = await MouvementStock.create({
            quantite,
            date: new Date(),
            type,
            idProduit,
            idUtilisateur: idUtilisateur || req.user.idUser,
            raison
        });

        // Mettre à jour le stock du produit
        const nouveauStock = type === 'ENTREE' 
            ? produit.stockActuel + quantite 
            : produit.stockActuel - quantite;
        
        await produit.update({ stockActuel: nouveauStock });

        res.status(201).json({
            message: 'Mouvement de stock enregistré avec succès',
            mouvement,
            nouveauStock
        });
    } catch (error) {
        console.error('Erreur enregistrement mouvement:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir tous les mouvements de stock
const getStockMovements = async (req, res) => {
    try {
        const { startDate, endDate, idProduit, type } = req.query;

        const whereClause = {};
        if (startDate && endDate) {
            whereClause.date = {
                [Op.between]: [startDate, endDate]
            };
        }
        if (idProduit) {
            whereClause.idProduit = idProduit;
        }
        if (type) {
            whereClause.type = type;
        }

        const mouvements = await MouvementStock.findAll({
            where: whereClause,
            include: [
                { model: Produit, as: 'produit', attributes: ['idProduit', 'nom'] },
                { model: Utilisateur, as: 'utilisateur', attributes: ['idUser', 'nom'] }
            ],
            order: [['date', 'DESC'], ['created_at', 'DESC']]
        });

        res.json(mouvements);
    } catch (error) {
        console.error('Erreur récupération mouvements:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir l'état actuel du stock
const getStockStatus = async (req, res) => {
    try {
        const produits = await Produit.findAll({
            include: [
                { model: Categorie, as: 'categorie', attributes: ['nomCategorie'] },
                { model: Fournisseur, as: 'fournisseur', attributes: ['nom'] }
            ],
            order: [['nom', 'ASC']]
        });

        const stockStatus = {
            totalProduits: produits.length,
            valeurTotaleStock: produits.reduce((sum, p) => sum + (p.prixVente * p.stockActuel), 0),
            produitsEnRupture: produits.filter(p => p.stockActuel === 0).length,
            produitsStockFaible: produits.filter(p => p.stockActuel <= p.seuilAlerte).length,
            produits: produits.map(p => ({
                idProduit: p.idProduit,
                nom: p.nom,
                stockActuel: p.stockActuel,
                seuilAlerte: p.seuilAlerte,
                prixVente: p.prixVente,
                categorie: p.categorie?.nomCategorie,
                fournisseur: p.fournisseur?.nom,
                est_actif: p.est_actif
            }))
        };

        res.json(stockStatus);
    } catch (error) {
        console.error('Erreur état du stock:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour le seuil d'alerte d'un produit
const updateProductThreshold = async (req, res) => {
    try {
        const { id } = req.params;
        const { seuilAlerte } = req.body;

        const produit = await Produit.findByPk(id);
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        await produit.update({ seuilAlerte });

        res.json({
            message: 'Seuil d\'alerte mis à jour avec succès',
            seuilAlerte: produit.seuilAlerte
        });
    } catch (error) {
        console.error('Erreur mise à jour seuil:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    recordStockMovement,
    getStockMovements,
    getStockStatus,
    updateProductThreshold
};
