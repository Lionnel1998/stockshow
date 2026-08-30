const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const StatutCommande = require('./StatutCommande');

const Commande = sequelize.define('Commande', {
    idCommande: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dateCommande: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    montantTotal: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    numero_commande: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: true
    },
    mode_paiement: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    idStatut: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: StatutCommande,
            key: 'idStatut'
        }
    }
}, {
    tableName: 'commande',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Commande;
