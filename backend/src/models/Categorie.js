const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Categorie = sequelize.define('Categorie', {
    idCategorie: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nomCategorie: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'categorie',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Categorie;
