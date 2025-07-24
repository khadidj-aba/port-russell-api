const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { isAdmin } = require('../middlewares/authMiddleware');

// Lister tous les utilisateurs
router.get('/', async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.render('users/index', { users });
});

// Formulaire ajout
router.get('/new', (req, res) => {
  res.render('users/new');
});

// Créer utilisateur
router.post('/', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Empêche l'ajout et affiche un message clair
      return res.send("❌ Un utilisateur avec cet email existe déjà.");
    }

    const newUser = new User({ username, email, password, role });
    await newUser.save();
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la création de l'utilisateur.");
  }
});

// Formulaire modification
router.get('/:id/edit', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('Utilisateur non trouvé');
  res.render('users/edit', { user });
});

// Modifier utilisateur
router.put('/:id', async (req, res) => {
  const { email, username, password } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('Utilisateur non trouvé');

  user.email = email;
  user.username = username;

  if (password && password.trim() !== '') {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();
  res.redirect('/users');
});

// ✅ Supprimer utilisateur (corrigé)
router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/users');
});

// ✅ Exemple : lister tous les utilisateurs (admin uniquement)
router.get('/', isAdmin, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.render('users/index', { users });
});

// ✅ Formulaire de création d’un utilisateur (admin uniquement)
router.get('/new', isAdmin, (req, res) => {
  res.render('users/new');
});

// ✅ Ajout d’un utilisateur
router.post('/', isAdmin, async (req, res) => {
  // ...
});


module.exports = router;
