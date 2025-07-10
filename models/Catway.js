// models/Catway.js

const mongoose = require('mongoose');

/**
 * Schéma des catways (appontements)
 */
const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: true,
    unique: true
  },
  catwayType: {
    type: String,
    enum: ['long', 'short'],
    required: true
  },
  catwayState: {
    type: String,
    enum: ['libre', 'occupé'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Catway', catwaySchema);
