// routes/home.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/home');
});

router.get('/home', (req, res) => {
  res.render('home');
});

router.get('/mentions', (req, res) => {
  res.render('mentions');
});

module.exports = router;
