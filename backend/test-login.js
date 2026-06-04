// Utiliser fetch natif de Node.js 18+

// Test de connexion avec l'utilisateur admin
const testLogin = async () => {
    try {
        console.log('🔐 Test de connexion...');
        
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
        } else {
            console.log('❌ Erreur de connexion:', data.message);
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
};

testLogin();
