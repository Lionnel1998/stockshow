const Entreprise = require('./Entreprise');
const Role = require('./Role');
const Categorie = require('./Categorie');
const StatutCommande = require('./StatutCommande');
const Fournisseur = require('./Fournisseur');
const Utilisateur = require('./Utilisateur');
const Produit = require('./Produit');
const Commande = require('./Commande');
const MouvementStock = require('./MouvementStock');
const Alerte = require('./Alerte');
const CommandeFournisseur = require('./CommandeFournisseur');
const LigneCommande = require('./LigneCommande');
const LigneFournisseur = require('./LigneFournisseur');
const Perte = require('./Perte');
const Prevision = require('./Prevision');
const RecommandationAchat = require('./RecommandationAchat');

// Définir les associations selon le schéma SQL
const setupAssociations = () => {
    // Utilisateur - Role et Entreprise
    Utilisateur.belongsTo(Role, { foreignKey: 'idRole', as: 'role' });
    Role.hasMany(Utilisateur, { foreignKey: 'idRole', as: 'utilisateurs' });
    
    Utilisateur.belongsTo(Entreprise, { foreignKey: 'idEntreprise', as: 'entreprise' });
    Entreprise.hasMany(Utilisateur, { foreignKey: 'idEntreprise', as: 'utilisateurs' });

    // Produit - Categorie, Fournisseur, Entreprise
    Produit.belongsTo(Categorie, { foreignKey: 'idCategorie', as: 'categorie' });
    Categorie.hasMany(Produit, { foreignKey: 'idCategorie', as: 'produits' });

    Produit.belongsTo(Fournisseur, { foreignKey: 'idFournisseur', as: 'fournisseur' });
    Fournisseur.hasMany(Produit, { foreignKey: 'idFournisseur', as: 'produits' });

    Produit.belongsTo(Entreprise, { foreignKey: 'idEntreprise', as: 'entreprise' });
    Entreprise.hasMany(Produit, { foreignKey: 'idEntreprise', as: 'produits' });

    // Commande - StatutCommande
    Commande.belongsTo(StatutCommande, { foreignKey: 'idStatut', as: 'statut' });
    StatutCommande.hasMany(Commande, { foreignKey: 'idStatut', as: 'commandes' });

    // MouvementStock - Produit et Utilisateur
    MouvementStock.belongsTo(Produit, { foreignKey: 'idProduit', as: 'produit' });
    Produit.hasMany(MouvementStock, { foreignKey: 'idProduit', as: 'mouvements' });

    MouvementStock.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur', as: 'utilisateur' });
    Utilisateur.hasMany(MouvementStock, { foreignKey: 'idUtilisateur', as: 'mouvements' });

    // Alerte - Produit
    Alerte.belongsTo(Produit, { foreignKey: 'produitId', as: 'produit' });
    Produit.hasMany(Alerte, { foreignKey: 'produitId', as: 'alertes' });

    // CommandeFournisseur - Fournisseur
    CommandeFournisseur.belongsTo(Fournisseur, { foreignKey: 'idFournisseur', as: 'fournisseur' });
    Fournisseur.hasMany(CommandeFournisseur, { foreignKey: 'idFournisseur', as: 'commandes' });

    // LigneCommande - Commande
    LigneCommande.belongsTo(Commande, { foreignKey: 'idCommande', as: 'commande' });
    Commande.hasMany(LigneCommande, { foreignKey: 'idCommande', as: 'lignes' });

    // LigneFournisseur - CommandeFournisseur
    LigneFournisseur.belongsTo(CommandeFournisseur, { foreignKey: 'idCommandeFournisseur', as: 'commandeFournisseur' });
    CommandeFournisseur.hasMany(LigneFournisseur, { foreignKey: 'idCommandeFournisseur', as: 'lignes' });
};

// Exporter tous les modèles
module.exports = {
    Entreprise,
    Role,
    Categorie,
    StatutCommande,
    Fournisseur,
    Utilisateur,
    Produit,
    Commande,
    MouvementStock,
    Alerte,
    CommandeFournisseur,
    LigneCommande,
    LigneFournisseur,
    Perte,
    Prevision,
    RecommandationAchat,
    setupAssociations
};
