const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LigneCommande = sequelize.define('LigneCommande', {
    idLigne: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    prixUnitaire: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    remise: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    idCommande: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'lignecommande',
    timestamps: false
});

module.exports = LigneCommande;
