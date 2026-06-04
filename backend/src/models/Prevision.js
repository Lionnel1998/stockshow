const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Prevision = sequelize.define('Prevision', {
    idPrevision: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    periode: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    quantitePrevue: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_debut: {
        type: DataTypes.DATEONLY
    },
    date_fin: {
        type: DataTypes.DATEONLY
    },
    methode_calcul: {
        type: DataTypes.STRING(50)
    },
    fiabilite: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    contexte_local: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'prevision',
    timestamps: false
});

module.exports = Prevision;
