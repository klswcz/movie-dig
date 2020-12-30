const express = require('express')
const router = express.Router();
const {check} = require('express-validator')
const dashboardController = require('../controllers/movies');

// Display dashboard movies
router.get('/movies/trending', dashboardController.trending)

module.exports = router;
