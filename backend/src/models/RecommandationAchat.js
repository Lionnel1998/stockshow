const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RecommandationAchat = sequelize.define('RecommandationAchat', {
    idRecommandation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date_recommandation: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    quantite_conseillee: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_limite_commande: {
        type: DataTypes.DATEONLY
    },
    justification: {
        type: DataTypes.TEXT
    },
    statut: {
        type: DataTypes.STRING(50),
        defaultValue: 'a_faire'
    }
}, {
    tableName: 'recommandationachat',
    timestamps: false
});

module.exports = RecommandationAchat;
