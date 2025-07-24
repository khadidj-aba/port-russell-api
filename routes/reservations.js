const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

// ✅ Middleware d'authentification
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.userId) return next();
  res.redirect('/login');
}

// ✅ Liste des réservations
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ startDate: 1 });
    res.render('reservations/index', { reservations });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur lors de l'affichage des réservations");
  }
});

// ✅ Formulaire de création
router.get('/new', ensureAuthenticated, async (req, res) => {
  try {
    const catways = await Catway.find();
    res.render('reservations/new', { messages: {}, catways });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur lors de l'affichage du formulaire");
  }
});

// ✅ Création d’une réservation
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

    if (new Date(endDate) < new Date(startDate)) {
      const catways = await Catway.find();
      return res.render('reservations/new', {
        catways,
        messages: { error: ['La date de fin doit être après la date de début.'] }
      });
    }

    const conflict = await Reservation.findOne({
      catwayNumber,
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    if (conflict) {
      const catways = await Catway.find();
      return res.render('reservations/new', {
        catways,
        messages: { error: ['❌ Ce catway est déjà réservé sur cette période.'] }
      });
    }

    await Reservation.create({ catwayNumber, clientName, boatName, startDate, endDate });
    res.redirect('/reservations');
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur lors de la création");
  }
});

// ✅ Formulaire d’édition
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    const catways = await Catway.find();
    res.render('reservations/edit', { reservation, catways });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur lors de l'affichage du formulaire d'édition");
  }
});

// ✅ Mise à jour (PUT)
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

    await Reservation.findByIdAndUpdate(req.params.id, {
      catwayNumber,
      clientName,
      boatName,
      startDate,
      endDate
    });

    res.redirect('/reservations');
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur lors de la mise à jour");
  }
});

// ✅ Suppression (DELETE)
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.redirect('/reservations');
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur lors de la suppression");
  }
});

module.exports = router;
