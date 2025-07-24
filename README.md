# ⚓ Port de plaisance de Russell - Gestion des Catways

Ce projet est une application Node.js avec Express et MongoDB permettant la gestion complète des **catways** (appontements), **réservations**, **utilisateurs**, et l’accès à un **tableau de bord** sécurisé.

---

## 🧰 Technologies utilisées

- **Node.js**
- **Express.js**
- **MongoDB** + **Mongoose**
- **EJS** (moteur de templates)
- **CSS** personnalisé
- **MongoDB Compass**
- **Sessions** via `express-session`
- **Middlewares personnalisés** (`isLoggedIn`, `isAdmin`)
- **Method-override** pour les méthodes PUT/DELETE

---

## 🚀 Fonctionnalités

- ✅ Authentification : inscription, connexion, déconnexion
- ✅ Tableau de bord dynamique avec statistiques
- ✅ Gestion des **catways** : création, modification, suppression, affichage
- ✅ Gestion des **réservations** : création avec vérification de conflit, modification, suppression
- ✅ Gestion des **utilisateurs** (réservée aux admins)
- ✅ Protection des routes avec middleware (`isLoggedIn`, `isAdmin`)
- ✅ Page dédiée à la **documentation de l’API**
- ✅ Sécurité : mots de passe hachés (`bcrypt`), sessions sécurisées
- ✅ Interface harmonisée (CSS sobre et cohérent)
- ✅ Compatible **responsive mobile**

---

## 👤 Utilisateur de test

Un utilisateur administrateur est fourni pour tester directement les fonctionnalités :

- **Email** : `admin@port-russell.com`
- **Mot de passe** : `123456`

> Ce compte possède les **droits administrateur** ✅

---

## 📁 Arborescence simplifiée

port-russell/
├── models/
├── routes/
├── views/
├── public/
│ └── css/
├── middlewares/
├── app.js
├── .env
└── README.md
