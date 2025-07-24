
// ✅ services/reservationService.js
const Reservation = require('../models/Reservation');

exports.getAllReservations = () => Reservation.find();

exports.getReservationById = (id) => Reservation.findById(id);

exports.createReservation = (data) => {
  const reservation = new Reservation(data);
  return reservation.save();
};

exports.updateReservation = (id, data) => {
  return Reservation.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteReservation = (id) => Reservation.findByIdAndDelete(id);
