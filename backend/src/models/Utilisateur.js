const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const Entreprise = require('./Entreprise');
const Role = require('./Role');

const Utilisateur = sequelize.define('Utilisateur', {
    idUser: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    motDePasse: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    derniere_connexion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    est_actif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    statut_inscription: {
        type: DataTypes.STRING(20),
        defaultValue: 'en_attente'
    },
    idEntreprise: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Entreprise,
            key: 'idEntreprise'
        }
    },
    idRole: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'idRole'
        }
    }
}, {
    tableName: 'utilisateur',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    hooks: {
        beforeCreate: async (user) => {
            if (user.motDePasse) {
                const salt = await bcrypt.genSalt(10);
                user.motDePasse = await bcrypt.hash(user.motDePasse, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('motDePasse')) {
                const salt = await bcrypt.genSalt(10);
                user.motDePasse = await bcrypt.hash(user.motDePasse, salt);
            }
        }
    }
});

// Méthodes du modèle
Utilisateur.prototype.verifierMotDePasse = async function(motDePasse) {
    return await bcrypt.compare(motDePasse, this.motDePasse);
};

module.exports = Utilisateur;
