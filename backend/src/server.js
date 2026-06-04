const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/database');
const { setupAssociations } = require('./models');

// Charger les variables d'environnement
dotenv.config();

// Créer l'application Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurer les associations entre modèles
setupAssociations();

// Connexion à MySQL et démarrage du serveur
const startServer = async () => {
    try {
        // Connexion à la base de données
        await connectDB();
        
        // Routes
        app.use('/api/auth', require('./routes/auth'));
        app.use('/api/users', require('./routes/users'));
        app.use('/api/roles', require('./routes/roles'));
        app.use('/api/products', require('./routes/products'));
        app.use('/api/categories', require('./routes/categories'));
        app.use('/api/suppliers', require('./routes/suppliers'));
        app.use('/api/sales', require('./routes/sales'));
        app.use('/api/stock', require('./routes/stock'));
        app.use('/api/alerts', require('./routes/alerts'));
        app.use('/api/supplier-orders', require('./routes/supplier-orders'));
        app.use('/api/losses', require('./routes/losses'));
        app.use('/api/forecasts', require('./routes/forecasts'));
        app.use('/api/recommendations', require('./routes/recommendations'));

        // Route racine
        app.get('/', (req, res) => {
            res.json({ 
                message: 'Backend StockShow API',
                version: '1.0.0',
                endpoints: {
                    test: '/api/test',
                    auth: '/api/auth',
                    users: '/api/users',
                    products: '/api/products',
                    categories: '/api/categories',
                    suppliers: '/api/suppliers',
                    sales: '/api/sales',
                    stock: '/api/stock',
                    alerts: '/api/alerts'
                }
            });
        });

        // Route de test
        app.get('/api/test', (req, res) => {
            res.json({ message: 'Backend StockShow avec MySQL fonctionne !' });
        });

        // Démarrer le serveur
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Serveur démarré sur le port ${PORT}`);
            console.log(`📊 Base de données: MySQL avec Sequelize`);
        });
    } catch (error) {
        console.error('❌ Erreur de démarrage du serveur:', error);
        process.exit(1);
    }
};

// Démarrer le serveur
startServer();

module.exports = app;
