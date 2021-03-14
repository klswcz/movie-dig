const Rating = require('../models/Rating');
const validator = require('../validator')
const Movie = require("../models/Movie");
const User = require("../models/User");
const mongoose = require("mongoose");
const Types = mongoose.Types;


exports.update = (req, res, next) => {
    User.findOne({email: req.params.token.username}).then(user => {
        Movie.findOne({tmdbId: req.body.movieId}).then(movie => {
            if (movie === null) {
                let movieModel = new Movie({
                    movieId: (new Types.ObjectId).toString(),
                    imdbId: null,
                    tmdbId: req.body.movieId
                })

                movieModel.save().then(error => {
                    movie = movieModel;
                })
            }
            Rating.findOne({
                userId: user.id,
                movieId: movie.movieId
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
                        movieId: movie.movieId,
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
                    movieId: movie.movieId
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
        Movie.findOne({tmdbId: req.query.movieId}).then(movie => {
            Rating.deleteOne({
                userId: user.id,
                movieId: movie.movieId
            }).then(item => {
                return res.send({
                    flashMessageBag: [{msg: 'Rating has been deleted.'}],
                    rating: null,
                });

            })
        })
    })
}
