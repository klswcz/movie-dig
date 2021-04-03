const Rating = require('../models/Rating');
const validator = require('../validator')
const Movie = require("../models/Movie");
const User = require("../models/User");
const mongoose = require("mongoose");
const Types = mongoose.Types;


exports.update = (req, res, next) => {
    let promises = []

    User.findOne({email: req.params.token.username}).then(user => {
        Movie.findOne({tmdb_id: req.body.movie_id}).then(movie => {
            if (movie === null) {
                let movieModel = new Movie({
                    movie_id: (new Types.ObjectId).toString(),
                    imdb_id: null,
                    tmdb_id: req.body.movie_id
                })

                promises.push(new Promise((resolve, reject) => {
                    movieModel.save().then(() => {
                        movie = movieModel
                        resolve()
                    })
                }))
            }

            Promise.all(promises).then(() => {
                Rating.findOne({
                    user_id: user.id,
                    movie_id: movie.movie_id
                }).then(rating => {
                    if (rating) {
                        rating.rating = req.body.rating
                        rating.timestamp = Date.now()
                        rating.save(error => {
                            if (req.body.rating_count) {
                                Rating.find({user_id: user.id}).then(ratings => {
                                    return res.send({
                                        flashMessageBag: [{msg: 'Rating has been updated.'}],
                                        rating: rating.rating,
                                        rating_count: ratings.length
                                    });
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
                            user_id: user.id,
                            movie_id: movie.movie_id,
                            rating: req.body.rating,
                            timestamp: Date.now()
                        })

                        ratingModel.save(() => {
                            if (req.body.rating_count) {
                                Rating.find({user_id: user.id}).then(ratings => {
                                    return res.send({
                                        flashMessageBag: [{msg: 'Rating has been saved.'}],
                                        rating: ratingModel.rating,
                                        rating_count: ratings.length
                                    });
                                })
                            } else {
                                return res.send({
                                    flashMessageBag: [{msg: 'Rating has been saved.'}],
                                    rating: ratingModel.rating
                                });
                            }
                        })
                    }
                })
            })
        })
    })
}

exports.get = (req, res, next) => {
    const movieId = req.params[0];

    User.findOne({email: req.params.token.username}).then(user => {
        Movie.findOne({tmdb_id: movieId}).then(movie => {
            if (movie) {
                Rating.findOne({
                    user_id: user.id,
                    movie_id: movie.movie_id
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
        Movie.findOne({tmdb_id: req.query.movie_id}).then(movie => {
            Rating.deleteOne({
                user_id: user.id,
                movie_id: movie.movie_id
            }).then(item => {
                if (req.query.rating_count) {
                    Rating.find({user_id: user.id}).then(ratings => {
                        return res.send({
                            flashMessageBag: [{msg: 'Rating has been deleted.'}],
                            rating: null,
                            rating_count: ratings.length
                        });
                    })
                } else {
                    return res.send({
                        flashMessageBag: [{msg: 'Rating has been deleted.'}],
                        rating: null,
                    });
                }
            })
        })
    })
}

exports.count = (req, res, next) => {
    User.findOne({email: req.params.token.username}).then(user => {
        Rating.find({user_id: user.id}).then(ratings => {
            return res.send({
                flashMessageBag: [{msg: 'Rating has been deleted.'}],
                rating_count: ratings.length
            });
        })
    })
}
