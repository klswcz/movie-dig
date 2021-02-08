const express = require('express')
const router = express.Router();
const {check} = require('express-validator')
const moviesController = require('../controllers/movies');
const usersController = require('../controllers/users');
const wishlistItemsController = require('../controllers/wishlistItems')
const ratingsController = require('../controllers/ratings')


// MOVIES
router.get('/movies/trending', moviesController.trending)
router.get('/movies/recommended', moviesController.recommendations)
router.get('/movies/*', moviesController.getMovie)

// USER
router.post('/register', [
    check('email', 'Invalid email format.')
        .exists()
        .isEmail(),
    check('password', 'Password needs to be between 8 and 20 characters long.')
        .isLength({min: 8, max: 20})
], usersController.register)
router.post('/login', [
    check('email', 'Invalid email format.')
        .notEmpty()
        .isEmail(),
    check('password', 'Invalid password.')
        .notEmpty()
        .isLength({min: 8, max: 20})
], usersController.login)
router.get('/account', usersController.account)

// WISHLIST
router.post('/wishlist/add', [check('movieId').notEmpty()], wishlistItemsController.create)
router.post('/wishlist/delete', [check('movieId').notEmpty()], wishlistItemsController.destroy)

// MOVIE RATING
router.get('/rating/user/*', ratingsController.getRating)
router.post('/rating/user/update',
    [check('rating').notEmpty().isFloat({min: 0.5, max: 5})],
    ratingsController.update
)
router.post('/rating/user/delete',
    [check('movieId').notEmpty()],
    ratingsController.destroy
)
module.exports = router;
