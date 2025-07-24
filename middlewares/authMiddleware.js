/**
 * Middleware pour vérifier si l'utilisateur est authentifié
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next(); // OK → l'utilisateur est connecté
  }
  // Sinon, on le redirige vers la page de connexion
  res.redirect('/login');
};

/**
 * Middleware pour empêcher l'accès aux pages de login/register quand déjà connecté
 */
exports.isGuest = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard'); // Déjà connecté
  }
  next(); // Pas connecté → autorisé
};

/**
 * Middleware pour vérifier les rôles admin
 */
exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).send('Accès refusé : réservée aux administrateurs');
};




