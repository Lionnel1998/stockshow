const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LigneFournisseur = sequelize.define('LigneFournisseur', {
    idLigneFournisseur: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    prixAchat: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    quantite_recue: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    idCommandeFournisseur: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'lignefournisseur',
    timestamps: false
});

module.exports = LigneFournisseur;
