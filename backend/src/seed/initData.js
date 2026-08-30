const { Role, User, Categorie, Fournisseur, Produit } = require('../models');
const bcrypt = require('bcryptjs');

const initializeData = async () => {
    try {
        console.log('🌱 Initialisation des données de base...');

        // 1. Créer les rôles de base
        const roles = [
            { idRole: 1, nomRole: 'Administrateur', description: 'Accès complet à toutes les fonctionnalités', niveau_acces: 100, color: '#8854C0', icon: 'admin_panel_settings' },
            { idRole: 2, nomRole: 'Gérant', description: 'Supervision et rapports complets', niveau_acces: 70, color: '#7551FF', icon: 'bar_chart' },
            { idRole: 3, nomRole: 'Gestionnaire', description: 'Gestion des opérations quotidiennes', niveau_acces: 50, color: '#05CD99', icon: 'inventory_2' }
        ];

        for (const roleData of roles) {
            await Role.findOrCreate({
                where: { idRole: roleData.idRole },
                defaults: roleData
            });
        }
        console.log('✅ Rôles créés');

        // 2. Créer l'utilisateur administrateur par défaut
        const adminRole = await Role.findOne({ where: { idRole: 1 } });
        const motDePasseAdmin = await bcrypt.hash('admin123', 10);
        
        await User.findOrCreate({
            where: { email: 'admin@stockshow.com' },
            defaults: {
                nom: 'Administrateur',
                email: 'admin@stockshow.com',
                motDePasse: motDePasseAdmin,
                roleId: adminRole.id,
                emailVerifie: true,
                actif: true
            }
        });
        console.log('✅ Utilisateur admin créé');

        // 3. Créer des catégories
        const categories = [
            { nomCategorie: 'Électronique', description: 'Produits électroniques et gadgets' },
            { nomCategorie: 'Vêtements', description: 'Habillement et accessoires' },
            { nomCategorie: 'Alimentation', description: 'Produits alimentaires et boissons' },
            { nomCategorie: 'Mobilier', description: 'Meubles et décoration' }
        ];

        for (const catData of categories) {
            await Categorie.findOrCreate({
                where: { nomCategorie: catData.nomCategorie },
                defaults: catData
            });
        }
        console.log('✅ Catégories créées');

        // 4. Créer des fournisseurs
        const fournisseurs = [
            { nom: 'TechSupplier Pro', email: 'contact@techsupplier.com', telephone: '+229 97 12 34 56', delaiLivraison: 5 },
            { nom: 'Fashion House', email: 'info@fashionhouse.com', telephone: '+229 98 76 54 32', delaiLivraison: 7 },
            { nom: 'FoodMart', telephone: '+229 95 47 36 25', delaiLivraison: 3 }
        ];

        for (const fourData of fournisseurs) {
            await Fournisseur.findOrCreate({
                where: { nom: fourData.nom },
                defaults: fourData
            });
        }
        console.log('✅ Fournisseurs créés');

        // 5. Créer des produits exemples
        const categorieElectronique = await Categorie.findOne({ where: { nomCategorie: 'Électronique' } });
        const categorieVetements = await Categorie.findOne({ where: { nomCategorie: 'Vêtements' } });
        const fournisseurTech = await Fournisseur.findOne({ where: { nom: 'TechSupplier Pro' } });
        const fournisseurFashion = await Fournisseur.findOne({ where: { nom: 'Fashion House' } });

        const produits = [
            {
                nom: 'Smartphone Pro Max',
                categorieId: categorieElectronique.id,
                fournisseurId: fournisseurTech.id,
                prixVente: 85000,
                prixAchat: 65000,
                stock: 15,
                seuilAlerte: 5,
                description: 'Smartphone dernière génération',
                reference: 'SPM-2024'
            },
            {
                nom: 'Laptop UltraBook',
                categorieId: categorieElectronique.id,
                fournisseurId: fournisseurTech.id,
                prixVente: 150000,
                prixAchat: 120000,
                stock: 8,
                seuilAlerte: 3,
                description: 'Laptop professionnel haute performance',
                reference: 'LUB-2024'
            },
            {
                nom: 'T-Shirt Premium',
                categorieId: categorieVetements.id,
                fournisseurId: fournisseurFashion.id,
                prixVente: 5000,
                prixAchat: 3000,
                stock: 50,
                seuilAlerte: 10,
                description: 'T-shirt coton bio',
                reference: 'TSP-001'
            },
            {
                nom: 'Jean Slim Fit',
                categorieId: categorieVetements.id,
                fournisseurId: fournisseurFashion.id,
                prixVente: 12000,
                prixAchat: 8000,
                stock: 3,
                seuilAlerte: 5,
                description: 'Jean slim fit denim',
                reference: 'JSF-002'
            }
        ];

        for (const prodData of produits) {
            await Produit.findOrCreate({
                where: { reference: prodData.reference },
                defaults: prodData
            });
        }
        console.log('✅ Produits créés');

        console.log('🎉 Initialisation terminée avec succès !');
        console.log('📝 Identifiants de connexion :');
        console.log('   Email: admin@stockshow.com');
        console.log('   Mot de passe: admin123');

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
    }
};

// Exécuter l'initialisation
if (require.main === module) {
    initializeData();
}

module.exports = initializeData;
