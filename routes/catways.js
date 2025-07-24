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

// ✅ POST /catways — enregistrement d’un nouveau catway
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

// ✅ GET /catways/:id/edit — formulaire de modification
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id).lean();
    if (!catway) return res.status(404).send('Catway non trouvé');
    res.render('catways/edit', { catway });
  } catch (err) {
    console.error('Erreur GET /catways/:id/edit :', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// ✅ PUT /catways/:id — enregistrer la modification
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;
    await Catway.findByIdAndUpdate(req.params.id, {
      catwayNumber,
      catwayType,
      catwayState
    });
    res.redirect('/catways');
  } catch (err) {
    console.error('Erreur PUT /catways/:id :', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// ✅ DELETE /catways/:id — suppression
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Catway.findByIdAndDelete(req.params.id);
    res.redirect('/catways');
  } catch (err) {
    console.error('Erreur DELETE /catways/:id :', err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
