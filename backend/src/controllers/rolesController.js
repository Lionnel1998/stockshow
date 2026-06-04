const { Role } = require('../models');

// Obtenir tous les rôles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll({
            order: [['niveau_acces', 'DESC']]
        });
        res.json(roles);
    } catch (error) {
        console.error('Erreur récupération rôles:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir un rôle par son ID
const getRoleById = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);

        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }

        res.json(role);
    } catch (error) {
        console.error('Erreur récupération rôle:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Créer un nouveau rôle
const createRole = async (req, res) => {
    try {
        const { nomRole, description, niveau_acces, color, icon } = req.body;

        // Validation
        if (!nomRole || !description || niveau_acces === undefined) {
            return res.status(400).json({ message: 'Nom, description et niveau d\'accès sont requis' });
        }

        // Vérifier si le rôle existe déjà
        const roleExistant = await Role.findOne({ where: { nomRole } });
        if (roleExistant) {
            return res.status(400).json({ message: 'Ce rôle existe déjà' });
        }

        // Créer le rôle
        const nouveauRole = await Role.create({
            nomRole,
            description,
            niveau_acces,
            color: color || '#8854C0',
            icon: icon || 'admin_panel_settings'
        });

        res.status(201).json({
            message: 'Rôle créé avec succès',
            role: nouveauRole
        });
    } catch (error) {
        console.error('Erreur création rôle:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour un rôle
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { nomRole, description, niveau_acces, color, icon } = req.body;

        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }

        // Si le nom est modifié, vérifier qu'il n'existe pas déjà
        if (nomRole && nomRole !== role.nomRole) {
            const roleExistant = await Role.findOne({ where: { nomRole } });
            if (roleExistant) {
                return res.status(400).json({ message: 'Ce rôle existe déjà' });
            }
        }

        // Empêcher la modification du niveau d'accès du rôle Administrateur
        if (role.nomRole === 'Administrateur' && niveau_acces !== undefined && niveau_acces !== 3) {
            return res.status(403).json({ message: 'Impossible de modifier le niveau d\'accès du rôle Administrateur' });
        }

        // Mettre à jour le rôle
        await role.update({
            nomRole: nomRole || role.nomRole,
            description: description !== undefined ? description : role.description,
            niveau_acces: niveau_acces !== undefined ? niveau_acces : role.niveau_acces,
            color: color || role.color,
            icon: icon || role.icon
        });

        res.json({
            message: 'Rôle mis à jour avec succès',
            role
        });
    } catch (error) {
        console.error('Erreur mise à jour rôle:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer un rôle
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }

        // Empêcher la suppression du rôle Administrateur
        if (role.nomRole === 'Administrateur') {
            return res.status(403).json({ message: 'Impossible de supprimer le rôle Administrateur' });
        }

        await role.destroy();

        res.json({ message: 'Rôle supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression rôle:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};
