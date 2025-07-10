// utils/authMiddleware.js

function isAdmin(req, res, next) {
  if (req.session.role === 'admin') {
    return next(); // autorisé
  } else {
    return res.status(403).send('⛔ Accès refusé. Réservé aux administrateurs.');
  }
}

module.exports = { isAdmin };
