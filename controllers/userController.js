// ✅ controllers/userController.js
const userService = require('../services/userService');

exports.getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.render('users/index', { users });
};

exports.getUserByEmail = async (req, res) => {
  const user = await userService.getUserByEmail(req.params.email);
  if (!user) return res.status(404).send('Utilisateur non trouvé');
  res.render('users/show', { user });
};

exports.createUser = async (req, res) => {
  try {
    await userService.createUser(req.body);
    res.redirect('/users');
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.editUser = async (req, res) => {
  const user = await userService.getUserByEmail(req.params.email);
  res.render('users/edit', { user });
};

exports.updateUser = async (req, res) => {
  try {
    await userService.updateUser(req.params.email, req.body);
    res.redirect('/users');
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.email);
  res.redirect('/users');
};
