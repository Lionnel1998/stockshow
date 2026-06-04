const { Alerte, Produit } = require('../models');

// Obtenir toutes les alertes
const getAllAlerts = async (req, res) => {
    try {
        const { lue, traitee, niveau, type } = req.query;

        const whereClause = {};
        if (lue !== undefined) whereClause.lue = lue === 'true';
        if (traitee !== undefined) whereClause.traitee = traitee === 'true';
        if (niveau) whereClause.niveau = niveau;
        if (type) whereClause.type = type;

        const alertes = await Alerte.findAll({
            where: whereClause,
            include: [
                { model: Produit, as: 'produit', attributes: ['idProduit', 'nom', 'stockActuel', 'seuilAlerte'] }
            ],
            order: [['dateAlerte', 'DESC'], ['createdAt', 'DESC']]
        });

        res.json(alertes);
    } catch (error) {
        console.error('Erreur récupération alertes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir une alerte par son ID
const getAlertById = async (req, res) => {
    try {
        const alerte = await Alerte.findByPk(req.params.id, {
            include: [
                { model: Produit, as: 'produit' }
            ]
        });

        if (!alerte) {
            return res.status(404).json({ message: 'Alerte non trouvée' });
        }

        res.json(alerte);
    } catch (error) {
        console.error('Erreur récupération alerte:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Marquer une alerte comme lue
const markAlertAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const alerte = await Alerte.findByPk(id);
        if (!alerte) {
            return res.status(404).json({ message: 'Alerte non trouvée' });
        }

        await alerte.update({ lue: true });

        res.json({
            message: 'Alerte marquée comme lue',
            alerte
        });
    } catch (error) {
        console.error('Erreur marquage alerte:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Marquer une alerte comme traitée
const markAlertAsResolved = async (req, res) => {
    try {
        const { id } = req.params;
        const { resolution } = req.body;

        const alerte = await Alerte.findByPk(id);
        if (!alerte) {
            return res.status(404).json({ message: 'Alerte non trouvée' });
        }

        await alerte.update({
            traitee: true,
            dateTraitement: new Date(),
            message: alerte.message + (resolution ? ` - Résolution: ${resolution}` : '')
        });

        res.json({
            message: 'Alerte marquée comme traitée',
            alerte
        });
    } catch (error) {
        console.error('Erreur résolution alerte:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Marquer toutes les alertes comme lues
const markAllAlertsAsRead = async (req, res) => {
    try {
        await Alerte.update(
            { lue: true },
            { where: { lue: false } }
        );

        res.json({ message: 'Toutes les alertes ont été marquées comme lues' });
    } catch (error) {
        console.error('Erreur marquage alertes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir les statistiques des alertes
const getAlertsStats = async (req, res) => {
    try {
        const totalAlertes = await Alerte.count();
        const alertesNonLues = await Alerte.count({ where: { lue: false } });
        const alertesNonTraitees = await Alerte.count({ where: { traitee: false } });
        const alertesCritiques = await Alerte.count({ where: { niveau: 'CRITIQUE' } });

        const alertesParNiveau = await Alerte.findAll({
            attributes: ['niveau'],
            group: ['niveau'],
            raw: true
        });

        const alertesParType = await Alerte.findAll({
            attributes: ['type'],
            group: ['type'],
            raw: true
        });

        res.json({
            totalAlertes,
            alertesNonLues,
            alertesNonTraitees,
            alertesCritiques,
            alertesParNiveau,
            alertesParType
        });
    } catch (error) {
        console.error('Erreur statistiques alertes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer une alerte
const deleteAlert = async (req, res) => {
    try {
        const { id } = req.params;

        const alerte = await Alerte.findByPk(id);
        if (!alerte) {
            return res.status(404).json({ message: 'Alerte non trouvée' });
        }

        await alerte.destroy();

        res.json({ message: 'Alerte supprimée avec succès' });
    } catch (error) {
        console.error('Erreur suppression alerte:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getAllAlerts,
    getAlertById,
    markAlertAsRead,
    markAlertAsResolved,
    markAllAlertsAsRead,
    getAlertsStats,
    deleteAlert
};
