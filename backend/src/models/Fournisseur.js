const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Fournisseur = sequelize.define('Fournisseur', {
    idFournisseur: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    telephone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    adresse: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    site_web: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 'fournisseur',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Fournisseur;
