const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1
  },
  catwayType: {
    type: String,
    enum: ['long', 'short'],
    required: true
  },
  catwayState: {
    type: String,
    default: 'libre',
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Catway', catwaySchema);
