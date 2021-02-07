const WishlistItem = require('../models/WishlistItem');
const validator = require('../validator')
const jwt = require('jsonwebtoken')
const Link = require("../models/Link");
const User = require("../models/User");


exports.create = (req, res, next) => {
    let errors = validator.getValidationErrors(req, res);

    if (errors.isEmpty()) {
        jwt.verify(req.headers.authorization.substring(7), process.env.JWT_SECRET, (err, token) => {
            User.findOne({email: token.username}).then(user => {
                Link.findOne({tmdbId: req.body.movieId}).then(movie => {

                        if (movie === null) {
                            let linkModel = new Link({
                                imdbId: null,
                                tmdbId: req.body.movieId
                            })

                            linkModel.save().then(error => {
                                movie = linkModel;
                            })

                        }

                        WishlistItem.findOne({
                            movie: {imdbId: movie.imdbId, tmdbId: movie.tmdbId},
                            user: {id: user.id}
                        }).then(item => {
                            if (item) {
                                return res.send({
                                    messageBag: [{msg: 'Movie already added to the wishlist.'}]
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
                                            messageBag: [{msg: 'Movie has been added to wish list.'}]
                                        });
                                    }
                                })
                            }
                        })
                    }
                )
            })
        })
    } else {
        res.status(422).json({
            messageBag: errors.array()
        });
    }
}
