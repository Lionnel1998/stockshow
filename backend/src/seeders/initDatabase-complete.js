const { sequelize } = require('../config/database');
const { Entreprise, Role, Categorie, StatutCommande, Fournisseur, Utilisateur, Produit, Commande, MouvementStock } = require('../models');
const bcrypt = require('bcryptjs');

// Initialisation complète de la base de données selon le schéma SQL
const initializeCompleteDatabase = async () => {
    try {
        console.log('🌱 Initialisation complète de la base de données...');

        // Synchroniser la base de données (forcer la recréation des tables)
        await sequelize.sync({ force: true });
        console.log('✅ Tables créées avec succès');

        // Créer l'entreprise par défaut
        const entreprise = await Entreprise.create({
            nom: 'StockShow Enterprise',
            adresse: '123 Rue du Commerce, Paris',
            telephone: '0123456789',
            email: 'contact@stockshow.com',
            date_creation: new Date('2023-01-01'),
            statut: 'active'
        });
        console.log('✅ Entreprise créée:', entreprise.nom);

        // Créer les rôles de base
        const roles = await Role.bulkCreate([
            {
                idRole: 1,
                nomRole: 'Administrateur',
                description: 'Accès complet au système',
                niveau_acces: 3
            },
            {
                idRole: 2,
                nomRole: 'Gérant',
                description: 'Gestion complète des stocks et ventes',
                niveau_acces: 2
            },
            {
                idRole: 3,
                nomRole: 'Gestionnaire',
                description: 'Gestion des stocks et produits',
                niveau_acces: 1
            }
        ]);
        console.log('✅ Rôles créés:', roles.length);

        // Créer les catégories
        const categories = await Categorie.bulkCreate([
            { nomCategorie: 'Électronique', description: 'Appareils électroniques' },
            { nomCategorie: 'Vêtements', description: 'Habillement et accessoires' },
            { nomCategorie: 'Alimentation', description: 'Produits alimentaires' },
            { nomCategorie: 'Maison', description: 'Articles pour la maison' }
        ]);
        console.log('✅ Catégories créées:', categories.length);

        // Créer les statuts de commande
        const statuts = await StatutCommande.bulkCreate([
            { idStatut: 1, libelle: 'En attente', description: 'Commande en attente de validation', ordre_affichage: 1 },
            { idStatut: 2, libelle: 'Validée', description: 'Commande validée', ordre_affichage: 2 },
            { idStatut: 3, libelle: 'En préparation', description: 'Commande en cours de préparation', ordre_affichage: 3 },
            { idStatut: 4, libelle: 'Expédiée', description: 'Commande expédiée', ordre_affichage: 4 },
            { idStatut: 5, libelle: 'Livrée', description: 'Commande livrée', ordre_affichage: 5 },
            { idStatut: 6, libelle: 'Annulée', description: 'Commande annulée', ordre_affichage: 6 }
        ]);
        console.log('✅ Statuts de commande créés:', statuts.length);

        // Créer les fournisseurs
        const fournisseurs = await Fournisseur.bulkCreate([
            {
                idFournisseur: 1,
                nom: 'TechSupplier Inc',
                telephone: '0123456789',
                email: 'contact@techsupplier.com',
                adresse: '123 Rue Tech, Paris',
                site_web: 'www.techsupplier.com'
            },
            {
                idFournisseur: 2,
                nom: 'Fashion World',
                telephone: '0987654321',
                email: 'info@fashionworld.com',
                adresse: '456 Avenue Mode, Lyon',
                site_web: 'www.fashionworld.com'
            }
        ]);
        console.log('✅ Fournisseurs créés:', fournisseurs.length);

        // Créer un utilisateur administrateur
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await Utilisateur.create({
            nom: 'Administrateur',
            email: 'admin@stockshow.com',
            motDePasse: adminPassword,
            idEntreprise: entreprise.idEntreprise,
            idRole: 1,
            est_actif: true,
            statut_inscription: 'actif'
        });
        console.log('✅ Utilisateur admin créé');

        // Créer des produits
        const produits = await Produit.bulkCreate([
            {
                idProduit: 1,
                nom: 'Smartphone Pro',
                description: 'Smartphone haut de gamme',
                prixVente: 899.99,
                prixAchat: 650.00,
                stockActuel: 50,
                seuilAlerte: 10,
                est_actif: true,
                idEntreprise: entreprise.idEntreprise,
                idCategorie: 1,
                idFournisseur: 1,
                code_barre: '1234567890123'
            },
            {
                idProduit: 2,
                nom: 'T-shirt Premium',
                description: 'T-shirt en coton bio',
                prixVente: 29.99,
                prixAchat: 15.00,
                stockActuel: 100,
                seuilAlerte: 20,
                est_actif: true,
                idEntreprise: entreprise.idEntreprise,
                idCategorie: 2,
                idFournisseur: 2,
                code_barre: '2345678901234'
            },
            {
                idProduit: 3,
                nom: 'Laptop Ultra',
                description: 'Ordinateur portable performant',
                prixVente: 1299.99,
                prixAchat: 950.00,
                stockActuel: 25,
                seuilAlerte: 5,
                est_actif: true,
                idEntreprise: entreprise.idEntreprise,
                idCategorie: 1,
                idFournisseur: 1,
                code_barre: '3456789012345'
            }
        ]);
        console.log('✅ Produits créés:', produits.length);

        // Créer une commande de test
        const commande = await Commande.create({
            dateCommande: new Date(),
            montantTotal: 929.98,
            numero_commande: 'CMD-2023-001',
            mode_paiement: 'Carte bancaire',
            notes: 'Commande client VIP',
            idStatut: 2
        });
        console.log('✅ Commande créée');

        // Créer des mouvements de stock
        const mouvements = await MouvementStock.bulkCreate([
            {
                quantite: 50,
                date: new Date('2023-01-15'),
                type: 'ENTREE',
                idProduit: 1,
                idUtilisateur: admin.idUser
            },
            {
                quantite: 100,
                date: new Date('2023-01-16'),
                type: 'ENTREE',
                idProduit: 2,
                idUtilisateur: admin.idUser
            },
            {
                quantite: 25,
                date: new Date('2023-01-17'),
                type: 'ENTREE',
                idProduit: 3,
                idUtilisateur: admin.idUser
            },
            {
                quantite: 1,
                date: new Date(),
                type: 'SORTIE',
                idProduit: 1,
                idUtilisateur: admin.idUser
            }
        ]);
        console.log('✅ Mouvements de stock créés:', mouvements.length);

        console.log('🎉 Base de données initialisée avec succès !');
        console.log('📝 Utilisateur de test: admin@stockshow.com / admin123');
        console.log('🏢 Entreprise: StockShow Enterprise');
        console.log('📊 Produits:', produits.length, 'créés');
        console.log('📦 Mouvements de stock:', mouvements.length, 'créés');

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
    } finally {
        await sequelize.close();
    }
};

// Exécuter l'initialisation
if (require.main === module) {
    initializeCompleteDatabase();
}

module.exports = initializeCompleteDatabase;
