const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Entreprise = sequelize.define('Entreprise', {
    idEntreprise: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    adresse: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    telephone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    date_creation: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    statut: {
        type: DataTypes.STRING(20),
        defaultValue: 'active'
    }
}, {
    tableName: 'entreprise',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Entreprise;
