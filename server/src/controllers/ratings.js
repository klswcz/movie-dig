const Rating = require('../models/Rating');
const validator = require('../validator')
const Movie = require("../models/Movie");
const User = require("../models/User");


exports.update = (req, res, next) => {
    User.findOne({email: req.params.token.username}).then(user => {
        Movie.findOne({tmdbId: req.body.movieId}).then(movie => {

            if (movie === null) {
                let movieModel = new Movie({
                    imdbId: null,
                    tmdbId: req.body.movieId
                })

                movieModel.save().then(error => {
                    movie = movieModel;
                })
            }

            Rating.findOne({
                userId: user.id,
                movieId: movie.id
            }).then(rating => {
                if (rating) {
                    rating.rating = req.body.rating
                    rating.timestamp = Date.now()
                    rating.save(error => {
                        if (error) {
                            return res.status(500).json({
                                flashMessageBag: [{msg: error}]
                            })
                        } else {
                            return res.send({
                                flashMessageBag: [{msg: 'Rating has been updated.'}],
                                rating: rating.rating
                            });
                        }
                    })
                } else {
                    let ratingModel = new Rating({
                        userId: user.id,
                        movieId: movie.id,
                        rating: req.body.rating,
                        timestamp: Date.now()
                    })

                    ratingModel.save(error => {
                        if (error) {
                            return res.status(500).json({
                                flashMessageBag: [{msg: error}]
                            })
                        } else {
                            return res.send({
                                flashMessageBag: [{msg: 'Rating has been added saved.'}],
                                rating: ratingModel.rating
                            });
                        }
                    })
                }
            })
        })
    })
}

exports.get = (req, res, next) => {
    const movieId = req.params[0];

    User.findOne({email: req.params.token.username}).then(user => {
        Movie.findOne({tmdbId: movieId}).then(movie => {
            if (movie) {
                Rating.findOne({
                    userId: user.id,
                    movieId: movie.id
                }).then(ratingModel => {
                    return res.status(200).json({
                        rating: ratingModel ? ratingModel.rating : null
                    })

                })
            } else {
                return res.status(200).json({
                    rating: null
                })
            }
        })
    })
}

exports.destroy = (req, res, next) => {
    User.findOne({email: req.params.token.username}).then(user => {
        Movie.findOne({tmdbId: req.body.movieId}).then(movie => {

            Rating.deleteOne({
                userId: user.id,
                movieId: movie.id
            }).then(item => {
                return res.send({
                    flashMessageBag: [{msg: 'Rating has been deleted.'}],
                    rating: null,
                });

            })
        })
    })
}
