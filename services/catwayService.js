// ✅ services/catwayService.js
const Catway = require('../models/Catway');

exports.getAllCatways = () => Catway.find();

exports.getCatwayById = (id) => Catway.findById(id);

exports.createCatway = (data) => {
  const catway = new Catway(data);
  return catway.save();
};

exports.updateCatwayState = (id, newState) => {
  return Catway.findByIdAndUpdate(id, { catwayState: newState }, { new: true });
};

exports.deleteCatway = (id) => Catway.findByIdAndDelete(id);

