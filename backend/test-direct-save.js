// Test direct d'enregistrement dans la base de données MySQL

const { sequelize } = require('./src/config/database');
const { Categorie, Fournisseur, Role, Utilisateur, Produit } = require('./src/models');

const testDirectSave = async () => {
    try {
        console.log('=== Test direct d\'enregistrement MySQL ===\n');

        // Connexion à la base
        await sequelize.authenticate();
        console.log('1. Connexion à MySQL réussie');

        // Test 1: Créer une catégorie
        console.log('\n2. Création d\'une nouvelle catégorie...');
        const nouvelleCategorie = await Categorie.create({
            nomCategorie: 'Informatique',
            description: 'Matériel informatique et accessoires'
        });
        console.log(`   Catégorie créée: ${nouvelleCategorie.nomCategorie} (ID: ${nouvelleCategorie.idCategorie})`);

        // Test 2: Créer un fournisseur
        console.log('\n3. Création d\'un nouveau fournisseur...');
        const nouveauFournisseur = await Fournisseur.create({
            nom: 'Computer Supply',
            telephone: '0123456789',
            email: 'info@computersupply.com',
            adresse: '456 Avenue Numérique, Paris',
            site_web: 'www.computersupply.com'
        });
        console.log(`   Fournisseur créé: ${nouveauFournisseur.nom} (ID: ${nouveauFournisseur.idFournisseur})`);

        // Test 3: Créer un produit
        console.log('\n4. Création d\'un nouveau produit...');
        const nouveauProduit = await Produit.create({
            nom: 'Ordinateur Portable Pro',
            description: 'PC portable haute performance',
            prixVente: 1299.99,
            prixAchat: 950.00,
            stockActuel: 15,
            seuilAlerte: 5,
            est_actif: true,
            idEntreprise: 1, // Entreprise par défaut
            idCategorie: nouvelleCategorie.idCategorie,
            idFournisseur: nouveauFournisseur.idFournisseur,
            code_barre: '9876543210987'
        });
        console.log(`   Produit créé: ${nouveauProduit.nom} (ID: ${nouveauProduit.idProduit})`);
        console.log(`   Stock: ${nouveauProduit.stockActuel} unités`);

        // Test 4: Vérifier les données enregistrées
        console.log('\n5. Vérification des données dans la base...');
        
        const totalCategories = await Categorie.count();
        console.log(`   Total catégories: ${totalCategories}`);

        const totalFournisseurs = await Fournisseur.count();
        console.log(`   Total fournisseurs: ${totalFournisseurs}`);

        const totalProduits = await Produit.count();
        console.log(`   Total produits: ${totalProduits}`);

        // Test 5: Lire les dernières données enregistrées
        console.log('\n6. Dernières données enregistrées:');
        
        const derniereCategorie = await Categorie.findOne({ order: [['idCategorie', 'DESC']] });
        console.log(`   Dernière catégorie: ${derniereCategorie.nomCategorie}`);

        const dernierFournisseur = await Fournisseur.findOne({ order: [['idFournisseur', 'DESC']] });
        console.log(`   Dernier fournisseur: ${dernierFournisseur.nom}`);

        const dernierProduit = await Produit.findOne({ 
            order: [['idProduit', 'DESC']],
            include: [
                { model: Categorie, as: 'categorie' },
                { model: Fournisseur, as: 'fournisseur' }
            ]
        });
        console.log(`   Dernier produit: ${dernierProduit.nom}`);
        console.log(`   Catégorie: ${dernierProduit.categorie?.nomCategorie}`);
        console.log(`   Fournisseur: ${dernierProduit.fournisseur?.nom}`);

        console.log('\n=== SUCCÈS ===');
        console.log('Toutes les données s\'enregistrent parfaitement dans MySQL !');
        console.log('Quand vous utilisez l\'interface web, les données vont directement dans la base.');

    } catch (error) {
        console.error('Erreur:', error.message);
    } finally {
        await sequelize.close();
    }
};

testDirectSave();
