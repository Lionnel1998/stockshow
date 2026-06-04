const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CommandeFournisseur = sequelize.define('CommandeFournisseur', {
    idCommandeFournisseur: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dateCommande: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    statut: {
        type: DataTypes.STRING(50),
        defaultValue: 'en_attente',
        allowNull: false
    },
    numero_commande: {
        type: DataTypes.STRING(50),
        unique: true
    },
    date_livraison_prevue: {
        type: DataTypes.DATEONLY
    },
    montant_total: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    idFournisseur: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'commandefournisseur',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = CommandeFournisseur;
