// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Schéma utilisateur pour la capitainerie
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Le nom d’utilisateur est requis'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'L’email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Format d’email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user' // 👈 Par défaut, l'utilisateur est un simple utilisateur
  }
}, {
  timestamps: true
});

/**
 * Middleware Mongoose :
 * Hash du mot de passe avant enregistrement en BDD
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // éviter de rehacher le mot de passe
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Méthode personnalisée : comparer mot de passe
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
