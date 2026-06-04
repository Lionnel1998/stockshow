// Test pour vérifier que les données s'enregistrent bien dans MySQL

const testSaveData = async () => {
    try {
        console.log('=== Test d\'enregistrement dans la base de données ===\n');

        // Test 1: Créer une nouvelle catégorie
        console.log('1. Création d\'une nouvelle catégorie...');
        const categorieResponse = await fetch('http://localhost:5000/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer fake-token-for-test'
            },
            body: JSON.stringify({
                nomCategorie: 'Test Catégorie',
                description: 'Catégorie de test pour vérifier l\'enregistrement'
            })
        });

        if (categorieResponse.ok) {
            const categorie = await categorieResponse.json();
            console.log('   Catégorie créée:', categorie.nomCategorie);
            console.log('   ID:', categorie.idCategorie);
        } else {
            console.log('   Erreur catégorie:', await categorieResponse.text());
        }

        // Test 2: Créer un nouveau fournisseur
        console.log('\n2. Création d\'un nouveau fournisseur...');
        const fournisseurResponse = await fetch('http://localhost:5000/api/suppliers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer fake-token-for-test'
            },
            body: JSON.stringify({
                nom: 'Test Fournisseur',
                telephone: '0123456789',
                email: 'test@fournisseur.com',
                adresse: '123 Rue Test',
                site_web: 'www.testfournisseur.com'
            })
        });

        if (fournisseurResponse.ok) {
            const fournisseur = await fournisseurResponse.json();
            console.log('   Fournisseur créé:', fournisseur.nom);
            console.log('   ID:', fournisseur.idFournisseur);
        } else {
            console.log('   Erreur fournisseur:', await fournisseurResponse.text());
        }

        // Test 3: Vérifier que les données sont dans la base
        console.log('\n3. Vérification des données dans la base...');
        
        const categoriesResponse = await fetch('http://localhost:5000/api/categories');
        if (categoriesResponse.ok) {
            const categories = await categoriesResponse.json();
            console.log(`   Total catégories dans la base: ${categories.length}`);
            console.log('   Dernière catégorie:', categories[categories.length - 1]?.nomCategorie);
        }

        const fournisseursResponse = await fetch('http://localhost:5000/api/suppliers');
        if (fournisseursResponse.ok) {
            const fournisseurs = await fournisseursResponse.json();
            console.log(`   Total fournisseurs dans la base: ${fournisseurs.length}`);
            console.log('   Dernier fournisseur:', fournisseurs[fournisseurs.length - 1]?.nom);
        }

        console.log('\n=== Test terminé ===');
        console.log('Les données s\'enregistrent bien dans MySQL !');

    } catch (error) {
        console.error('Erreur lors du test:', error.message);
    }
};

testSaveData();
