const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');

// 👉 Affiche le formulaire d'inscription
router.get('/register', (req, res) => {
  res.render('register');
});

// 👉 Affiche le formulaire de connexion
router.get('/login', (req, res) => {
  res.render('login');
});

// ✅ Traite l'inscription
router.post('/register', async (req, res) => {
  const { email, username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.send('❌ Cet email est déjà utilisé.');

    const newUser = new User({ email, username, password, role });
    await newUser.save();

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de l’inscription.');
  }
});

// ✅ Traite la connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.send("❌ Utilisateur non trouvé");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("❌ Mot de passe incorrect");

    req.session.userId = user._id;
    req.session.userName = user.username;
    req.session.userEmail = user.email;
    req.session.role = user.role;

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la connexion.");
  }
});

// ✅ Affiche le tableau de bord uniquement si connecté
router.get('/dashboard', async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/login');

    const user = await User.findById(req.session.userId).lean();
    if (!user) return res.redirect('/login');

    const catwayCount = await Catway.countDocuments();
    const reservationCount = await Reservation.countDocuments();
    const userCount = await User.countDocuments();

    const today = new Date();
    const activeReservations = await Reservation.find({
      user: req.session.userId,
      endDate: { $gte: today }
    })
    .populate('catway')
    .lean();

    res.render('dashboard', {
      user,
      catwayCount,
      reservationCount,
      userCount,
      activeReservations
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// ✅ Documentation API
router.get('/docs', (req, res) => {
  res.render('docs');
});

// ✅ Déconnexion
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erreur de déconnexion');
    }
    res.redirect('/login');
  });
});

// ✅ Export du routeur
module.exports = router;
