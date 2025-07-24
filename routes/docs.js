const express = require('express');
const router = express.Router();

// GET /docs
router.get('/docs', (req, res) => {
  res.render('docs'); // charge views/docs.ejs
});

module.exports = router;
