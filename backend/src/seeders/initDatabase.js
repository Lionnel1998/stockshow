const { sequelize } = require('../config/database');
const { Role, User, Categorie, Fournisseur, Produit } = require('../models');
const bcrypt = require('bcryptjs');

// Initialisation de la base de données avec des données de test
const initializeDatabase = async () => {
    try {
        console.log('🌱 Initialisation de la base de données...');

        // Synchroniser la base de données (forcer la recréation des tables)
        await sequelize.sync({ force: true });
        console.log('✅ Tables créées avec succès');

        // Créer les rôles de base
        const roles = await Role.bulkCreate([
            {
                idRole: 1,
                nomRole: 'Administrateur',
                description: 'Accès complet au système',
                niveau_acces: 3,
                color: '#4318FF',
                icon: 'admin_panel_settings'
            },
            {
                idRole: 2,
                nomRole: 'Gérant',
                description: 'Gestion complète des stocks et ventes',
                niveau_acces: 2,
                color: '#7551FF',
                icon: 'bar_chart'
            },
            {
                idRole: 3,
                nomRole: 'Gestionnaire',
                description: 'Gestion des stocks et produits',
                niveau_acces: 1,
                color: '#05CD99',
                icon: 'inventory_2'
            }
        ]);
        console.log('✅ Rôles créés:', roles.length);

        // Créer un utilisateur administrateur
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await User.create({
            nom: 'Administrateur',
            email: 'admin@stockshow.com',
            motDePasse: adminPassword,
            roleId: 1,
            actif: true
        });
        console.log('✅ Utilisateur admin créé');

        // Créer des catégories
        const categories = await Categorie.bulkCreate([
            { nomCategorie: 'Électronique', description: 'Appareils électroniques' },
            { nomCategorie: 'Vêtements', description: 'Habillement et accessoires' },
            { nomCategorie: 'Alimentation', description: 'Produits alimentaires' },
            { nomCategorie: 'Maison', description: 'Articles pour la maison' }
        ]);
        console.log('✅ Catégories créées:', categories.length);

        // Créer des fournisseurs
        const fournisseurs = await Fournisseur.bulkCreate([
            {
                nomFournisseur: 'TechSupplier Inc',
                contact: 'Jean Dupont',
                email: 'contact@techsupplier.com',
                telephone: '0123456789',
                adresse: '123 Rue Tech, Paris'
            },
            {
                nomFournisseur: 'Fashion World',
                contact: 'Marie Martin',
                email: 'info@fashionworld.com',
                telephone: '0987654321',
                adresse: '456 Avenue Mode, Lyon'
            }
        ]);
        console.log('✅ Fournisseurs créés:', fournisseurs.length);

        // Créer des produits
        const produits = await Produit.bulkCreate([
            {
                nomProduit: 'Smartphone Pro',
                categorieId: 1,
                fournisseurId: 1,
                prixVente: 899.99,
                prixAchat: 650.00,
                quantite: 50,
                seuilAlerte: 10,
                description: 'Smartphone haut de gamme'
            },
            {
                nomProduit: 'T-shirt Premium',
                categorieId: 2,
                fournisseurId: 2,
                prixVente: 29.99,
                prixAchat: 15.00,
                quantite: 100,
                seuilAlerte: 20,
                description: 'T-shirt en coton bio'
            },
            {
                nomProduit: 'Laptop Ultra',
                categorieId: 1,
                fournisseurId: 1,
                prixVente: 1299.99,
                prixAchat: 950.00,
                quantite: 25,
                seuilAlerte: 5,
                description: 'Ordinateur portable performant'
            }
        ]);
        console.log('✅ Produits créés:', produits.length);

        console.log('🎉 Base de données initialisée avec succès !');
        console.log('📝 Utilisateur de test: admin@stockshow.com / admin123');

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
    } finally {
        await sequelize.close();
    }
};

// Exécuter l'initialisation
if (require.main === module) {
    initializeDatabase();
}

module.exports = initializeDatabase;
