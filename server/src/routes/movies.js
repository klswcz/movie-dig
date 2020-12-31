const express = require('express')
const router = express.Router();
const {check} = require('express-validator')
const dashboardController = require('../controllers/movies');

// Get trending movies
router.get('/movies/trending', dashboardController.trending)

router.get('/movies/recommended', dashboardController.recommendations)


module.exports = router;
