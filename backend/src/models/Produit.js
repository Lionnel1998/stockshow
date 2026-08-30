const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Produit = sequelize.define('Produit', {
    idProduit: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    prixVente: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    prixAchat: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    stockActuel: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    seuilAlerte: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    },
    code_barre: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: true
    },
    est_actif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    idEntreprise: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Entreprise',
            key: 'idEntreprise'
        }
    },
    idCategorie: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Categorie',
            key: 'idCategorie'
        }
    },
    idFournisseur: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Fournisseur',
            key: 'idFournisseur'
        }
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'produit',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Méthodes du modèle
Produit.prototype.verifierAlerte = function() {
    return this.stockActuel <= this.seuilAlerte;
};

Produit.prototype.genererMouvement = function(type, quantite, raison) {
    return {
        produitId: this.idProduit,
        type: type, // 'ENTREE' ou 'SORTIE'
        quantite: quantite,
        avant: this.stockActuel,
        apres: type === 'ENTREE' ? this.stockActuel + quantite : this.stockActuel - quantite,
        raison: raison,
        date: new Date()
    };
};

module.exports = Produit;
