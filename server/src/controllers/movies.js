const tmdb = require('../services/TmdbApi')
const User = require("../models/User");
const Movie = require("../models/Movie");
const WishlistItem = require("../models/WishlistItem");
const Rating = require("../models/Rating");

exports.trending = (req, res, next) => {
    let movieResponse = []

    tmdb.api.get('/trending/movie/week?api_key=' + process.env.TMDB_API_KEY).then(apiRes => {
        User.findOne({email: req.params.token.username}).then(user => {
            apiRes.data.results.forEach((movie, index) => {
                Movie.findOne({tmdbId: movie.id}).then(movieModel => {
                    Rating.findOne({userId: user.id, movieId: movieModel ? movieModel.id : null}).then(rating => {
                        if (rating !== null) {
                            apiRes.data.results[index].user_rating = rating.rating
                        }
                        movieResponse.push(apiRes.data.results[index])
                        if (movieResponse.length === apiRes.data.results.length) {
                            return res.status(200).json({
                                movies: movieResponse
                            })
                        }
                    })
                })
            })
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

    User.findOne({email: req.params.token.username}).then(user => {
        Movie.findOne({tmdbId: movieId}).then(movie => {

            if (movie === null) {
                let movieModel = new Movie({
                    imdbId: null,
                    tmdbId: movieId
                })

                movieModel.save().then(error => {
                    movie = movieModel;
                })
            } else {
                WishlistItem.findOne({
                    movie: {imdbId: movie.imdbId, tmdbId: movie.tmdbId},
                    user: {id: user.id}
                }).then(item => {
                    isWishlistItem = item !== null
                })
            }
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
