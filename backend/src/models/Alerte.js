const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Alerte = sequelize.define('Alerte', {
    idAlerte: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    produitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'produit',
            key: 'idProduit'
        }
    },
    type: {
        type: DataTypes.ENUM('RUPTURE', 'STOCK_FAIBLE', 'SURSTOCK'),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    niveau: {
        type: DataTypes.ENUM('CRITIQUE', 'MOYEN', 'FAIBLE'),
        allowNull: false
    },
    lue: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    traitee: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    dateAlerte: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    dateTraitement: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'alerte',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

module.exports = Alerte;
