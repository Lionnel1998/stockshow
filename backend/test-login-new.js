// Test de connexion avec le nouveau schéma
const testLogin = async () => {
    try {
        console.log('🔐 Test de connexion avec le nouveau schéma...');
        
        const response = await fetch('http://localhost:5000/api/auth/connexion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@stockshow.com',
                motDePasse: 'admin123'
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Connexion réussie!');
            console.log('Token:', data.token?.substring(0, 50) + '...');
            console.log('Utilisateur:', data.user);
            console.log('ID Utilisateur:', data.user.idUser);
            console.log('Rôle:', data.user.role);
        } else {
            console.log('❌ Erreur de connexion:', data.message);
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
};

testLogin();
