const Rating = require('../models/Rating');
const validator = require('../validator')
const jwt = require('jsonwebtoken')
const Movie = require("../models/Movie");
const User = require("../models/User");


exports.update = (req, res, next) => {
    let errors = validator.getValidationErrors(req, res);

    if (errors.isEmpty()) {
        jwt.verify(req.headers.authorization.substring(7), process.env.JWT_SECRET, (err, token) => {
            User.findOne({email: token.username}).then(user => {
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
                            rating.save(error => {
                                if (error) {
                                    return res.status(500).json({
                                        messageBag: [{msg: error}]
                                    })
                                } else {
                                    return res.send({
                                        messageBag: [{msg: 'Rating has been added updated.'}],
                                        rating: rating.rating
                                    });
                                }
                            })
                        } else {
                            let ratingModel = new Rating({
                                userId: user.id,
                                movieId: movie.id,
                                rating: req.body.rating,
                            })

                            ratingModel.save(error => {
                                if (error) {
                                    return res.status(500).json({
                                        messageBag: [{msg: error}]
                                    })
                                } else {
                                    return res.send({
                                        messageBag: [{msg: 'Rating has been added saved.'}],
                                        rating: ratingModel.rating
                                    });
                                }
                            })
                        }
                    })
                })
            })
        })
    } else {
        res.status(422).json({
            messageBag: errors.array()
        });
    }
}

exports.getRating = (req, res, next) => {
    const movieId = req.params[0];
    console.log(movieId);
    jwt.verify(req.headers.authorization.substring(7), process.env.JWT_SECRET, (err, token) => {
        User.findOne({email: token.username}).then(user => {
            Movie.findOne({tmdbId: movieId}).then(movie => {

                Rating.findOne({
                    userId: user.id,
                    movieId: movie.id
                }).then(ratingModel => {
                    return res.status(200).json({
                        rating: ratingModel.rating
                    })

                })
            })
        })
    })

}

exports.destroy = (req, res, next) => {
    let errors = validator.getValidationErrors(req, res);

    if (errors.isEmpty()) {
        jwt.verify(req.headers.authorization.substring(7), process.env.JWT_SECRET, (err, token) => {
            User.findOne({email: token.username}).then(user => {
                Movie.findOne({tmdbId: req.body.movieId}).then(movie => {

                    Rating.deleteOne({
                        userId: user.id,
                        movieId: movie.id
                    }).then(item => {
                        return res.send({
                            messageBag: [{msg: 'Rating has been deleted.'}],
                            rating: 0,
                        });

                    })
                })
            })
        })
    } else {
        res.status(422).json({
            messageBag: errors.array()
        });
    }
}
