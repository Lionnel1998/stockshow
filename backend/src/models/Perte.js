const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Perte = sequelize.define('Perte', {
    idPerte: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cause: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'perte',
    timestamps: false
});

module.exports = Perte;
