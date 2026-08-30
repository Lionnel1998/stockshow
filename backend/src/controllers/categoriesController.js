const { Categorie } = require('../models');

// Obtenir toutes les catégories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Categorie.findAll({
            order: [['nomCategorie', 'ASC']]
        });
        res.json(categories);
    } catch (error) {
        console.error('Erreur récupération catégories:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir une catégorie par son ID
const getCategoryById = async (req, res) => {
    try {
        const categorie = await Categorie.findByPk(req.params.id);

        if (!categorie) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        res.json(categorie);
    } catch (error) {
        console.error('Erreur récupération catégorie:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Créer une nouvelle catégorie
const createCategory = async (req, res) => {
    try {
        const { nomCategorie, description } = req.body;

        // Validation
        if (!nomCategorie) {
            return res.status(400).json({ message: 'Nom de la catégorie requis' });
        }

        // Vérifier si la catégorie existe déjà
        const categorieExistante = await Categorie.findOne({ where: { nomCategorie } });
        if (categorieExistante) {
            return res.status(400).json({ message: 'Cette catégorie existe déjà' });
        }

        // Créer la catégorie
        const nouvelleCategorie = await Categorie.create({
            nomCategorie,
            description
        });

        res.status(201).json({
            message: 'Catégorie créée avec succès',
            categorie: nouvelleCategorie
        });
    } catch (error) {
        console.error('Erreur création catégorie:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour une catégorie
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { nomCategorie, description } = req.body;

        const categorie = await Categorie.findByPk(id);
        if (!categorie) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        // Si le nom est modifié, vérifier qu'il n'existe pas déjà
        if (nomCategorie && nomCategorie !== categorie.nomCategorie) {
            const categorieExistante = await Categorie.findOne({ where: { nomCategorie } });
            if (categorieExistante) {
                return res.status(400).json({ message: 'Cette catégorie existe déjà' });
            }
        }

        // Mettre à jour la catégorie
        await categorie.update({
            nomCategorie: nomCategorie || categorie.nomCategorie,
            description: description !== undefined ? description : categorie.description
        });

        res.json({
            message: 'Catégorie mise à jour avec succès',
            categorie
        });
    } catch (error) {
        console.error('Erreur mise à jour catégorie:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer une catégorie
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const categorie = await Categorie.findByPk(id);
        if (!categorie) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        await categorie.destroy();

        res.json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
        console.error('Erreur suppression catégorie:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
