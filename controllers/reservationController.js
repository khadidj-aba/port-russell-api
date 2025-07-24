// ✅ controllers/reservationController.js
const reservationService = require('../services/reservationService');

exports.getAllReservations = async (req, res) => {
  const reservations = await reservationService.getAllReservations();
  res.render('reservations/index', { reservations });
};

exports.getReservationById = async (req, res) => {
  const reservation = await reservationService.getReservationById(req.params.id);
  if (!reservation) return res.status(404).send('Réservation non trouvée');
  res.render('reservations/show', { reservation });
};

exports.createReservation = async (req, res) => {
  try {
    await reservationService.createReservation(req.body);
    res.redirect('/reservations');
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.editReservation = async (req, res) => {
  const reservation = await reservationService.getReservationById(req.params.id);
  res.render('reservations/edit', { reservation });
};

exports.updateReservation = async (req, res) => {
  try {
    await reservationService.updateReservation(req.params.id, req.body);
    res.redirect('/reservations');
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteReservation = async (req, res) => {
  await reservationService.deleteReservation(req.params.id);
  res.redirect('/reservations');
};