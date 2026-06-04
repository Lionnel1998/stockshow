const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Role = sequelize.define('Role', {
    idRole: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nomRole: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    niveau_acces: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    tableName: 'role',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// Méthodes du modèle
Role.prototype.definirRole = function() {
    return `Rôle ${this.nomRole} défini avec succès`;
};

Role.prototype.modifierRole = function() {
    return `Rôle ${this.nomRole} modifié avec succès`;
};

module.exports = Role;
