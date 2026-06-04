const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StatutCommande = sequelize.define('StatutCommande', {
    idStatut: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    libelle: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ordre_affichage: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'statutcommande',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = StatutCommande;
