const tmdb = require('../services/TmdbApi')
const User = require("../models/User");
const Movie = require("../models/Movie");
const WishlistItem = require("../models/WishlistItem");
const jwt = require('jsonwebtoken')

exports.trending = (req, res, next) => {
    tmdb.api.get('/trending/movie/week?api_key=' + process.env.TMDB_API_KEY).then(apiRes => {
        return res.status(200).json({
            movies: apiRes.data.results
        })
    })
}

exports.recommendations = (req, res, next) => {
    tmdb.api.get('/trending/movies/week?api_key=' + process.env.TMDB_API_KEY).then(apiRes => {
        return res.status(200).json({
            movies: apiRes.data.results
        })
    })
}

exports.getMovie = (req, res, next) => {
    const movieId = req.params[0];
    let isWishlistItem = false;

    jwt.verify(req.headers.authorization.substring(7), process.env.JWT_SECRET, (err, token) => {
        User.findOne({email: token.username}).then(user => {
            Movie.findOne({tmdbId: movieId}).then(movie => {

                WishlistItem.findOne({
                    movie: {imdbId: movie.imdbId, tmdbId: movie.tmdbId},
                    user: {id: user.id}
                }).then(item => {
                    isWishlistItem = item !== null
                })
            })
        })
    })

    tmdb.api.get(`/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`).then(movieRes => {
        tmdb.api.get(`/movie/${movieId}/credits?api_key=${process.env.TMDB_API_KEY}`).then(creditsRes => {
            movieRes.data.credits = creditsRes.data
            return res.status(200).json({
                movie: movieRes.data,
                isWishlistItem: isWishlistItem
            })

        })
    })
}
