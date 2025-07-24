// ✅ services/authService.js
const User = require('../models/User');

exports.findByEmail = (email) => User.findOne({ email });

exports.createUser = async ({ username, email, password, role }) => {
  const user = new User({ username, email, password, role });
  return await user.save();
};
