const express = require("express")
const router = express.Router()
const { check, query } = require("express-validator")
const moviesController = require("../controllers/movies")
const usersController = require("../controllers/users")
const wishlistItemsController = require("../controllers/wishlistItems")
const ratingPropositionsController = require("../controllers/ratingPropositions")
const ratingsController = require("../controllers/ratings")
const jwtAuth = require("../middlewares/jwtAuth")
const returnValidationErrors = require("../middlewares/returnValidationErrors")

// MOVIES
router.get(
    "/movies/search",
    [jwtAuth, query("query").exists().isString().isLength({ min: 1 }), returnValidationErrors],
    moviesController.search
)
router.get("/movies/trending", jwtAuth, moviesController.trending)
router.get("/movies/top-rated", jwtAuth, moviesController.topRated)
router.get("/movies/popular", jwtAuth, moviesController.popular)
router.get("/movies/recommendations", jwtAuth, moviesController.recommendations)
router.get("/movies/top/:genre_id", jwtAuth, moviesController.topMovies)
router.get("/movies/:id/similar", jwtAuth, moviesController.getSimilar)
router.get("/movies/:id", jwtAuth, moviesController.get)

// USER
router.get("/account", jwtAuth, usersController.get)
router.post(
    "/account",
    [
        check("email", "Invalid email format.").exists().isEmail(),
        check("first_name", "Invalid first name.").exists().isString().isLength({ min: 1, max: 255 }),
        check("last_name", "Invalid last name.").exists().isString().isLength({ min: 1, max: 255 }),
        check("password", "Password needs to be between 8 and 50 characters long.")
            .exists()
            .isString()
            .isLength({ min: 8, max: 50 }),
        returnValidationErrors
    ],
    usersController.store
)
router.patch(
    "/account",
    [
        jwtAuth,
        check("email", "Invalid email format.").exists().isEmail(),
        check("first_name", "Invalid first name.").exists().isString().isLength({ min: 1, max: 255 }),
        check("last_name", "Invalid last name.").exists().isString().isLength({ min: 1, max: 255 }),
        returnValidationErrors
    ],
    usersController.update
)
router.delete("/account", jwtAuth, usersController.destroy)
router.post(
    "/account/login",
    [
        check("email", "Invalid email format.").notEmpty().isEmail(),
        check("password", "Password needs to be between 8 and 50 characters long.")
            .exists()
            .isString()
            .isLength({ min: 8, max: 50 }),
        returnValidationErrors
    ],
    usersController.login
)
router.post(
    "/account/password",
    [
        jwtAuth,
        check("password", "Password needs to be between 8 and 50 characters long.")
            .exists()
            .isString()
            .isLength({ min: 8, max: 50 }),
        check("old_password", "Password needs to be between 8 and 50 characters long.")
            .exists()
            .isString()
            .isLength({ min: 8, max: 50 }),
        returnValidationErrors
    ],
    usersController.updatePassword
)

// WISHLIST
router.get("/wishlist", jwtAuth, wishlistItemsController.get)
router.post("/wishlist", [jwtAuth, check("movie_id").notEmpty(), returnValidationErrors], wishlistItemsController.store)
router.delete(
    "/wishlist",
    [jwtAuth, check("movie_id").notEmpty(), returnValidationErrors],
    wishlistItemsController.destroy
)

// MOVIE RATING
router.post(
    "/ratings",
    [
        jwtAuth,
        check("rating").notEmpty().isFloat({ min: 0.5, max: 5 }),
        check("movie_id").notEmpty(),
        returnValidationErrors
    ],
    ratingsController.create
)
router.patch(
    "/ratings",
    [
        jwtAuth,
        check("rating").notEmpty().isFloat({ min: 0.5, max: 5 }),
        check("movie_id").notEmpty(),
        returnValidationErrors
    ],
    ratingsController.update
)
router.delete("/ratings", [jwtAuth, check("movie_id").notEmpty(), returnValidationErrors], ratingsController.destroy)
router.get("/ratings/count", jwtAuth, ratingsController.count)
router.get("/ratings/all", jwtAuth, ratingsController.accountRatings)
router.get("/ratings/:movie_id", jwtAuth, ratingsController.get)

// RATING PROPOSITIONS
router.get("/rating-propositions", jwtAuth, ratingPropositionsController.get)

module.exports = router
