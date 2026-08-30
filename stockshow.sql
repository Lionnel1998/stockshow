-- StockShow Database Schema
-- Version: 2.0 - Nettoyée et cohérente avec les modèles Sequelize
-- Date: 2026-05-26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `stockshow`
--

-- --------------------------------------------------------

--
-- Structure de la table `entreprise`
--

DROP TABLE IF EXISTS `entreprise`;
CREATE TABLE IF NOT EXISTS `entreprise` (
  `idEntreprise` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `adresse` varchar(150) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `date_creation` date DEFAULT NULL,
  `statut` varchar(20) DEFAULT 'active',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`idEntreprise`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `entreprise` (`idEntreprise`, `nom`, `adresse`, `telephone`, `email`, `date_creation`, `statut`, `created_at`) VALUES
(1, 'StockShow Enterprise', '123 Rue du Commerce, Paris', '0123456789', 'contact@stockshow.com', '2023-01-01', 'active', '2026-04-27 15:55:05');

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `idRole` int NOT NULL AUTO_INCREMENT,
  `nomRole` varchar(50) NOT NULL,
  `description` text,
  `niveau_acces` int DEFAULT '1',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`idRole`),
  UNIQUE KEY `nomRole` (`nomRole`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `role` (`idRole`, `nomRole`, `description`, `niveau_acces`, `created_at`) VALUES
(1, 'Administrateur', 'Accès complet au système', 3, '2026-04-27 15:55:05'),
(2, 'Gérant', 'Gestion complète des stocks et ventes', 2, '2026-04-27 15:55:05'),
(3, 'Gestionnaire', 'Gestion des stocks et produits', 1, '2026-04-27 15:55:05');

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

DROP TABLE IF EXISTS `categorie`;
CREATE TABLE IF NOT EXISTS `categorie` (
  `idCategorie` int NOT NULL AUTO_INCREMENT,
  `nomCategorie` varchar(100) NOT NULL,
  `description` text,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`idCategorie`),
  UNIQUE KEY `nomCategorie` (`nomCategorie`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categorie` (`idCategorie`, `nomCategorie`, `description`, `created_at`) VALUES
(1, 'Électronique', 'Appareils électroniques', '2026-04-27 15:55:06'),
(2, 'Vêtements', 'Habillement et accessoires', '2026-04-27 15:55:06'),
(3, 'Alimentation', 'Produits alimentaires', '2026-04-27 15:55:06'),
(4, 'Maison', 'Articles pour la maison', '2026-04-27 15:55:06'),
(5, 'Informatique', 'Matériel informatique et accessoires', '2026-04-29 19:56:41');

-- --------------------------------------------------------

--
-- Structure de la table `fournisseur`
--

DROP TABLE IF EXISTS `fournisseur`;
CREATE TABLE IF NOT EXISTS `fournisseur` (
  `idFournisseur` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `adresse` varchar(150) DEFAULT NULL,
  `site_web` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`idFournisseur`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `fournisseur` (`idFournisseur`, `nom`, `telephone`, `email`, `adresse`, `site_web`, `created_at`) VALUES
(1, 'TechSupplier Inc', '0123456789', 'contact@techsupplier.com', '123 Rue Tech, Paris', 'www.techsupplier.com', '2026-04-27 15:55:06'),
(2, 'Fashion World', '0987654321', 'info@fashionworld.com', '456 Avenue Mode, Lyon', 'www.fashionworld.com', '2026-04-27 15:55:06'),
(3, 'Computer Supply', '0123456789', 'info@computersupply.com', '456 Avenue Numérique, Paris', 'www.computersupply.com', '2026-04-29 19:56:43');

-- --------------------------------------------------------

--
-- Structure de la table `statutcommande`
--

DROP TABLE IF EXISTS `statutcommande`;
CREATE TABLE IF NOT EXISTS `statutcommande` (
  `idStatut` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(50) NOT NULL,
  `description` text,
  `ordre_affichage` int DEFAULT '0',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`idStatut`),
  UNIQUE KEY `libelle` (`libelle`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `statutcommande` (`idStatut`, `libelle`, `description`, `ordre_affichage`, `created_at`) VALUES
(1, 'En attente', 'Commande en attente de validation', 1, '2026-04-27 15:55:06'),
(2, 'Validée', 'Commande validée', 2, '2026-04-27 15:55:06'),
(3, 'En préparation', 'Commande en cours de préparation', 3, '2026-04-27 15:55:06'),
(4, 'Expédiée', 'Commande expédiée', 4, '2026-04-27 15:55:06'),
(5, 'Livrée', 'Commande livrée', 5, '2026-04-27 15:55:06'),
(6, 'Annulée', 'Commande annulée', 6, '2026-04-27 15:55:06');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `idUser` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `motDePasse` varchar(255) NOT NULL,
  `derniere_connexion` datetime DEFAULT NULL,
  `est_actif` tinyint(1) DEFAULT '1',
  `statut_inscription` varchar(20) DEFAULT 'en_attente',
  `idEntreprise` int NOT NULL,
  `idRole` int NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `email` (`email`),
  KEY `idEntreprise` (`idEntreprise`),
  KEY `idRole` (`idRole`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `utilisateur` (`idUser`, `nom`, `email`, `motDePasse`, `derniere_connexion`, `est_actif`, `statut_inscription`, `idEntreprise`, `idRole`, `created_at`) VALUES
(1, 'Administrateur', 'admin@stockshow.com', '$2b$10$PHqDjI6hqWHEk1rOAewV4elPBdOqKotNajHpb/JTp8fzibI6Lxt9O', NULL, 1, 'actif', 1, 1, '2026-04-27 15:55:07');

-- --------------------------------------------------------

--
-- Structure de la table `produit`
--

DROP TABLE IF EXISTS `produit`;
CREATE TABLE IF NOT EXISTS `produit` (
  `idProduit` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `description` text,
  `prixVente` double NOT NULL,
  `prixAchat` double NOT NULL,
  `stockActuel` int DEFAULT '0',
  `seuilAlerte` int DEFAULT '10',
  `code_barre` varchar(50) DEFAULT NULL,
  `est_actif` tinyint(1) DEFAULT '1',
  `idEntreprise` int NOT NULL,
  `idCategorie` int DEFAULT NULL,
  `idFournisseur` int DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`idProduit`),
  UNIQUE KEY `code_barre` (`code_barre`),
  KEY `idEntreprise` (`idEntreprise`),
  KEY `idCategorie` (`idCategorie`),
  KEY `idFournisseur` (`idFournisseur`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `produit` (`idProduit`, `nom`, `description`, `prixVente`, `prixAchat`, `stockActuel`, `seuilAlerte`, `code_barre`, `est_actif`, `idEntreprise`, `idCategorie`, `idFournisseur`, `image`, `created_at`, `updated_at`) VALUES
(1, 'Smartphone Pro', 'Smartphone haut de gamme', 899.99, 650, 50, 10, '1234567890123', 1, 1, 1, 1, NULL, '2026-04-27 15:55:08', '2026-04-27 15:55:08'),
(2, 'T-shirt Premium', 'T-shirt en coton bio', 29.99, 15, 100, 20, '2345678901234', 1, 1, 2, 2, NULL, '2026-04-27 15:55:08', '2026-04-27 15:55:08'),
(3, 'Laptop Ultra', 'Ordinateur portable performant', 1299.99, 950, 25, 5, '3456789012345', 1, 1, 1, 1, NULL, '2026-04-27 15:55:08', '2026-04-27 15:55:08'),
(4, 'Ordinateur Portable Pro', 'PC portable haute performance', 1299.99, 950, 15, 5, '9876543210987', 1, 1, 5, 3, NULL, '2026-04-29 19:56:44', '2026-04-29 19:56:44');

-- --------------------------------------------------------

--
-- Structure de la table `commande`
--

DROP TABLE IF EXISTS `commande`;
CREATE TABLE IF NOT EXISTS `commande` (
  `idCommande` int NOT NULL AUTO_INCREMENT,
  `dateCommande` date NOT NULL,
  `montantTotal` double DEFAULT '0',
  `numero_commande` varchar(50) DEFAULT NULL,
  `mode_paiement` varchar(50) DEFAULT NULL,
  `notes` text,
  `idStatut` int NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`idCommande`),
  UNIQUE KEY `numero_commande` (`numero_commande`),
  KEY `idStatut` (`idStatut`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `commande` (`idCommande`, `dateCommande`, `montantTotal`, `numero_commande`, `mode_paiement`, `notes`, `idStatut`, `created_at`) VALUES
(1, '2026-04-27', 929.98, 'CMD-2023-001', 'Carte bancaire', 'Commande client VIP', 2, '2026-04-27 15:55:08');

-- --------------------------------------------------------

--
-- Structure de la table `mouvementstock`
--

DROP TABLE IF EXISTS `mouvementstock`;
CREATE TABLE IF NOT EXISTS `mouvementstock` (
  `idMouvement` int NOT NULL AUTO_INCREMENT,
  `quantite` int NOT NULL,
  `date` date NOT NULL,
  `type` varchar(50) NOT NULL,
  `idProduit` int NOT NULL,
  `idUtilisateur` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`idMouvement`),
  KEY `idProduit` (`idProduit`),
  KEY `idUtilisateur` (`idUtilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mouvementstock` (`idMouvement`, `quantite`, `date`, `type`, `idProduit`, `idUtilisateur`, `created_at`) VALUES
(1, 50, '2023-01-15', 'ENTREE', 1, 1, '2026-04-27 15:55:08'),
(2, 100, '2023-01-16', 'ENTREE', 2, 1, '2026-04-27 15:55:08'),
(3, 25, '2023-01-17', 'ENTREE', 3, 1, '2026-04-27 15:55:08'),
(4, 1, '2026-04-27', 'SORTIE', 1, 1, '2026-04-27 15:55:08');

-- --------------------------------------------------------

--
-- Structure de la table `alerte`
--

DROP TABLE IF EXISTS `alerte`;
CREATE TABLE IF NOT EXISTS `alerte` (
  `idAlerte` int NOT NULL AUTO_INCREMENT,
  `produitId` int NOT NULL,
  `type` enum('RUPTURE','STOCK_FAIBLE','SURSTOCK') NOT NULL,
  `message` text NOT NULL,
  `niveau` enum('CRITIQUE','MOYEN','FAIBLE') NOT NULL,
  `lue` tinyint(1) DEFAULT '0',
  `traitee` tinyint(1) DEFAULT '0',
  `dateAlerte` datetime DEFAULT NULL,
  `dateTraitement` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`idAlerte`),
  KEY `produitId` (`produitId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `commandefournisseur`
--

DROP TABLE IF EXISTS `commandefournisseur`;
CREATE TABLE IF NOT EXISTS `commandefournisseur` (
  `idCommandeFournisseur` int NOT NULL AUTO_INCREMENT,
  `dateCommande` date NOT NULL,
  `statut` varchar(50) DEFAULT 'en_attente',
  `numero_commande` varchar(50) DEFAULT NULL,
  `date_livraison_prevue` date DEFAULT NULL,
  `montant_total` double DEFAULT '0',
  `idFournisseur` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idCommandeFournisseur`),
  UNIQUE KEY `numero_commande` (`numero_commande`),
  KEY `idx_cmd_fournis_date` (`dateCommande`),
  KEY `idx_cmd_fournis_fournisseur` (`idFournisseur`),
  KEY `idx_cmd_fournis_statut` (`statut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `lignecommande`
--

DROP TABLE IF EXISTS `lignecommande`;
CREATE TABLE IF NOT EXISTS `lignecommande` (
  `idLigne` int NOT NULL AUTO_INCREMENT,
  `prixUnitaire` double NOT NULL,
  `remise` double DEFAULT '0',
  `idCommande` int NOT NULL,
  PRIMARY KEY (`idLigne`),
  KEY `idCommande` (`idCommande`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `lignefournisseur`
--

DROP TABLE IF EXISTS `lignefournisseur`;
CREATE TABLE IF NOT EXISTS `lignefournisseur` (
  `idLigneFournisseur` int NOT NULL AUTO_INCREMENT,
  `prixAchat` double NOT NULL,
  `quantite_recue` int DEFAULT '0',
  `idCommandeFournisseur` int NOT NULL,
  PRIMARY KEY (`idLigneFournisseur`),
  KEY `idCommandeFournisseur` (`idCommandeFournisseur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `perte`
--

DROP TABLE IF EXISTS `perte`;
CREATE TABLE IF NOT EXISTS `perte` (
  `idPerte` int NOT NULL AUTO_INCREMENT,
  `cause` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`idPerte`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `prevision`
--

DROP TABLE IF EXISTS `prevision`;
CREATE TABLE IF NOT EXISTS `prevision` (
  `idPrevision` int NOT NULL AUTO_INCREMENT,
  `periode` varchar(50) NOT NULL,
  `quantitePrevue` int NOT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `methode_calcul` varchar(50) DEFAULT NULL,
  `fiabilite` double DEFAULT '0',
  `contexte_local` text,
  PRIMARY KEY (`idPrevision`),
  KEY `idx_prevision_periode` (`periode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `recommandationachat`
--

DROP TABLE IF EXISTS `recommandationachat`;
CREATE TABLE IF NOT EXISTS `recommandationachat` (
  `idRecommandation` int NOT NULL AUTO_INCREMENT,
  `date_recommandation` date NOT NULL,
  `quantite_conseillee` int NOT NULL,
  `date_limite_commande` date DEFAULT NULL,
  `justification` text,
  `statut` varchar(50) DEFAULT 'a_faire',
  PRIMARY KEY (`idRecommandation`),
  KEY `idx_recommandation_statut` (`statut`),
  KEY `idx_recommandation_date` (`date_recommandation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Contraintes pour les tables
--

ALTER TABLE `utilisateur`
  ADD CONSTRAINT `utilisateur_ibfk_1` FOREIGN KEY (`idEntreprise`) REFERENCES `entreprise` (`idEntreprise`),
  ADD CONSTRAINT `utilisateur_ibfk_2` FOREIGN KEY (`idRole`) REFERENCES `role` (`idRole`);

ALTER TABLE `produit`
  ADD CONSTRAINT `produit_ibfk_1` FOREIGN KEY (`idEntreprise`) REFERENCES `entreprise` (`idEntreprise`),
  ADD CONSTRAINT `produit_ibfk_2` FOREIGN KEY (`idCategorie`) REFERENCES `categorie` (`idCategorie`),
  ADD CONSTRAINT `produit_ibfk_3` FOREIGN KEY (`idFournisseur`) REFERENCES `fournisseur` (`idFournisseur`);

ALTER TABLE `commande`
  ADD CONSTRAINT `commande_ibfk_1` FOREIGN KEY (`idStatut`) REFERENCES `statutcommande` (`idStatut`);

ALTER TABLE `mouvementstock`
  ADD CONSTRAINT `mouvementstock_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `produit` (`idProduit`),
  ADD CONSTRAINT `mouvementstock_ibfk_2` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUser`);

ALTER TABLE `alerte`
  ADD CONSTRAINT `alerte_ibfk_1` FOREIGN KEY (`produitId`) REFERENCES `produit` (`idProduit`);

ALTER TABLE `commandefournisseur`
  ADD CONSTRAINT `commandefournisseur_ibfk_1` FOREIGN KEY (`idFournisseur`) REFERENCES `fournisseur` (`idFournisseur`);

ALTER TABLE `lignecommande`
  ADD CONSTRAINT `lignecommande_ibfk_1` FOREIGN KEY (`idCommande`) REFERENCES `commande` (`idCommande`);

ALTER TABLE `lignefournisseur`
  ADD CONSTRAINT `lignefournisseur_ibfk_1` FOREIGN KEY (`idCommandeFournisseur`) REFERENCES `commandefournisseur` (`idCommandeFournisseur`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
