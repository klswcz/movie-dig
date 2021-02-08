const WishlistItem = require('../models/WishlistItem');
const validator = require('../validator')
const jwt = require('jsonwebtoken')
const Movie = require("../models/Movie");
const User = require("../models/User");


exports.create = (req, res, next) => {
    let errors = validator.getValidationErrors(req, res);
    if (!errors.isEmpty()) {
        res.status(400).json({messageBag: errors.array()});
    }

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

                WishlistItem.findOne({
                    movie: {imdbId: movie.imdbId, tmdbId: movie.tmdbId},
                    user: {id: user.id}
                }).then(item => {
                    if (item) {
                        return res.send({
                            messageBag: [{msg: 'Movie already added to the wishlist.'}],
                            isWishlistItem: true
                        });
                    } else {
                        let wishlistItemModel = new WishlistItem({
                            movie: {
                                imdbId: null,
                                tmdbId: movie.tmdbId
                            },
                            user: {
                                id: user.id
                            }
                        })

                        wishlistItemModel.save(error => {
                            if (error) {
                                return res.status(500).json({
                                    messageBag: [{msg: error}]
                                })
                            } else {
                                return res.send({
                                    messageBag: [{msg: 'Movie has been added to wish list.'}],
                                    isWishlistItem: true,
                                });
                            }
                        })
                    }
                })
            })
        })
    })
}

exports.destroy = (req, res, next) => {
    let errors = validator.getValidationErrors(req, res);
    if (!errors.isEmpty()) {
        res.status(400).json({messageBag: errors.array()});
    }

    jwt.verify(req.headers.authorization.substring(7), process.env.JWT_SECRET, (err, token) => {
        User.findOne({email: token.username}).then(user => {
            Movie.findOne({tmdbId: req.body.movieId}).then(movie => {

                WishlistItem.deleteOne({
                    movie: {imdbId: movie.imdbId, tmdbId: movie.tmdbId},
                    user: {id: user.id}
                }).then(item => {
                    return res.send({
                        messageBag: [{msg: 'Movie has been removed from wish list.'}],
                        isWishlistItem: false,
                    });

                })
            })
        })
    })
}
