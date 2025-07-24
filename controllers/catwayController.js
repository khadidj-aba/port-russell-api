// ✅ controllers/catwayController.js
const catwayService = require('../services/catwayService');

exports.getAllCatways = async (req, res) => {
  const catways = await catwayService.getAllCatways();
  res.render('catways/index', { catways });
};

exports.getCatwayById = async (req, res) => {
  const catway = await catwayService.getCatwayById(req.params.id);
  if (!catway) return res.status(404).send('Catway non trouvé');
  res.render('catways/show', { catway });
};

exports.createCatway = async (req, res) => {
  try {
    await catwayService.createCatway(req.body);
    res.redirect('/catways');
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.editCatway = async (req, res) => {
  const catway = await catwayService.getCatwayById(req.params.id);
  res.render('catways/edit', { catway });
};

exports.updateCatway = async (req, res) => {
  try {
    await catwayService.updateCatwayState(req.params.id, req.body.catwayState);
    res.redirect('/catways');
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteCatway = async (req, res) => {
  await catwayService.deleteCatway(req.params.id);
  res.redirect('/catways');
};
