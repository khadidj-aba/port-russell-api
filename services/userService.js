
// ✅ services/userService.js
const User = require('../models/User');

exports.getAllUsers = () => User.find();

exports.getUserByEmail = (email) => User.findOne({ email });

exports.createUser = (data) => {
  const user = new User(data);
  return user.save();
};

exports.updateUser = (email, data) => {
  return User.findOneAndUpdate({ email }, data, { new: true });
};

exports.deleteUser = (email) => User.findOneAndDelete({ email });
