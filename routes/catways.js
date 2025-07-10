// routes/catways.js

const express = require('express');
const router = express.Router();
const Catway = require('../models/Catway');

// Middleware : vérifier l'authentification
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.userId) return next();
  res.redirect('/login');
}

// ✅ GET /catways — liste des catways
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const catways = await Catway.find().lean();
    res.render('catways/index', { user: req.session.userId, catways });
  } catch (err) {
    console.error('Erreur GET /catways :', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// ✅ GET /catways/new — formulaire d’ajout
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('catways/new', { message: null });
});

// ✅ POST /catways — traitement du formulaire
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    if (catwayNumber <= 0) {
      return res.render('catways/new', { message: '❌ Le numéro doit être > 0' });
    }

    const existing = await Catway.findOne({ catwayNumber });
    if (existing) {
      return res.render('catways/new', { message: '❌ Ce numéro existe déjà' });
    }

    await Catway.create({ catwayNumber, catwayType, catwayState });
    res.redirect('/catways');
  } catch (err) {
    console.error('Erreur POST /catways :', err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
