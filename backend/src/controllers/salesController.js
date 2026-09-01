const { Commande, StatutCommande, Utilisateur } = require('../models');
const { Op } = require('sequelize');

// Obtenir toutes les ventes/commandes
const getAllSales = async (req, res) => {
    try {
        const commandes = await Commande.findAll({
            include: [
                { model: StatutCommande, as: 'statut' },
                { model: Utilisateur, as: 'utilisateur', attributes: ['idUser', 'nom'] }
            ],
            order: [['dateCommande', 'DESC']]
        });
        res.json(commandes);
    } catch (error) {
        console.error('Erreur récupération commandes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir une commande par son ID
const getSaleById = async (req, res) => {
    try {
        const commande = await Commande.findByPk(req.params.id, {
            include: [
                { model: StatutCommande, as: 'statut' },
                { model: Utilisateur, as: 'utilisateur' }
            ]
        });

        if (!commande) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        res.json(commande);
    } catch (error) {
        console.error('Erreur récupération commande:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Créer une nouvelle commande
const createSale = async (req, res) => {
    try {
        const { dateCommande, montantTotal, numero_commande, mode_paiement, notes, idStatut } = req.body;

        // Validation
        if (!dateCommande || !idStatut) {
            return res.status(400).json({ message: 'Date et statut sont requis' });
        }

        // Vérifier si le statut existe
        const statut = await StatutCommande.findByPk(idStatut);
        if (!statut) {
            return res.status(400).json({ message: 'Statut non trouvé' });
        }

        // Créer la commande
        const nouvelleCommande = await Commande.create({
            dateCommande,
            montantTotal: montantTotal || 0,
            numero_commande,
            mode_paiement,
            notes,
            idStatut
        });

        // Récupérer la commande créée avec ses associations
        const commandeComplet = await Commande.findByPk(nouvelleCommande.idCommande, {
            include: [{ model: StatutCommande, as: 'statut' }]
        });

        res.status(201).json({
            message: 'Commande créée avec succès',
            commande: commandeComplet
        });
    } catch (error) {
        console.error('Erreur création commande:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour une commande
const updateSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { dateCommande, montantTotal, numero_commande, mode_paiement, notes, idStatut } = req.body;

        const commande = await Commande.findByPk(id);
        if (!commande) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        // Si le statut est modifié, vérifier qu'il existe
        if (idStatut && idStatut !== commande.idStatut) {
            const statut = await StatutCommande.findByPk(idStatut);
            if (!statut) {
                return res.status(400).json({ message: 'Statut non trouvé' });
            }
        }

        // Mettre à jour la commande
        await commande.update({
            dateCommande: dateCommande || commande.dateCommande,
            montantTotal: montantTotal !== undefined ? montantTotal : commande.montantTotal,
            numero_commande: numero_commande || commande.numero_commande,
            mode_paiement: mode_paiement !== undefined ? mode_paiement : commande.mode_paiement,
            notes: notes !== undefined ? notes : commande.notes,
            idStatut: idStatut || commande.idStatut
        });

        // Récupérer la commande mise à jour avec ses associations
        const commandeMisAJour = await Commande.findByPk(id, {
            include: [{ model: StatutCommande, as: 'statut' }]
        });

        res.json({
            message: 'Commande mise à jour avec succès',
            commande: commandeMisAJour
        });
    } catch (error) {
        console.error('Erreur mise à jour commande:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer une commande
const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;

        const commande = await Commande.findByPk(id);
        if (!commande) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        await commande.destroy();

        res.json({ message: 'Commande supprimée avec succès' });
    } catch (error) {
        console.error('Erreur suppression commande:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir les statistiques de ventes
const getSalesStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const whereClause = {};
        if (startDate && endDate) {
            whereClause.dateCommande = {
                [Op.between]: [startDate, endDate]
            };
        }

        const commandes = await Commande.findAll({
            where: whereClause,
            include: [{ model: StatutCommande, as: 'statut' }]
        });

        const totalVentes = commandes.reduce((sum, cmd) => sum + (cmd.montantTotal || 0), 0);
        const nombreCommandes = commandes.length;

        const statuts = {};
        commandes.forEach(cmd => {
            const statutNom = cmd.statut?.libelle || 'Inconnu';
            statuts[statutNom] = (statuts[statutNom] || 0) + 1;
        });

        res.json({
            totalVentes,
            nombreCommandes,
            statuts,
            commandes
        });
    } catch (error) {
        console.error('Erreur statistiques ventes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale,
    getSalesStats
};
