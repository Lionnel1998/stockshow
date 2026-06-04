const { Sequelize } = require('sequelize');

// Configuration de la base de données MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'stockshow',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test de connexion
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connecté à MySQL avec Sequelize');
    
    // Synchroniser les modèles
    await sequelize.sync({ force: false });
    console.log('📊 Base de données synchronisée');
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
