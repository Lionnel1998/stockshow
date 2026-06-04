const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Produit = require('./Produit');
const Utilisateur = require('./Utilisateur');

const MouvementStock = sequelize.define('MouvementStock', {
    idMouvement: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantite: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    idProduit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Produit,
            key: 'idProduit'
        }
    },
    idUtilisateur: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Utilisateur,
            key: 'idUser'
        }
    }
}, {
    tableName: 'mouvementstock',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = MouvementStock;
