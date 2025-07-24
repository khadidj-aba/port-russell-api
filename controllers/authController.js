const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Adresse email déjà utilisée.');
    }

    const user = new User({ username, email, password });
    await user.save();

    req.session.user = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role
    };
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Utilisateur non trouvé');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Mot de passe incorrect');

    req.session.user = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role
    };
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur de connexion');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
