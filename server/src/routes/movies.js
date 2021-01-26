const express = require('express')
const router = express.Router();
const {check} = require('express-validator')
const moviesController = require('../controllers/movies');

// Get trending movies
router.get('/movies/trending', moviesController.trending)

router.get('/movies/recommended', moviesController.recommendations)

router.get('/movies/*', moviesController.getMovie)


module.exports = router;
