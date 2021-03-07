const WishlistItem = require('../models/WishlistItem');
const Movie = require("../models/Movie");
const User = require("../models/User");
const tmdb = require('../services/TmdbApi')

exports.store = (req, res) => {
    User.findOne({email: req.params.token.username}).then(user => {
        Movie.findOne({tmdbId: req.body.movieId}).then(movie => {

            if (movie === null) {
                let movieModel = new Movie({
                    imdbId: null,
                    tmdbId: req.body.movieId
                })

                movieModel.save().then(() => {
                    movie = movieModel;
                })

            }

            WishlistItem.findOne({
                movie: {imdbId: movie.imdbId, tmdbId: movie.tmdbId},
                user: {id: user.id}
            }).then(item => {
                if (item) {
                    return res.send({
                        flashMessageBag: [{msg: 'Movie already added to the wishlist.'}],
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
                                flashMessageBag: [{msg: error}]
                            })
                        } else {
                            return res.send({
                                flashMessageBag: [{msg: 'Movie has been added to wish list.'}],
                                isWishlistItem: true,
                            });
                        }
                    })
                }
            })
        })
    })
}

exports.destroy = (req, res) => {
    User.findOne({email: req.params.token.username}).then(user => {
        Movie.findOne({tmdbId: req.body.movieId}).then(movie => {

            WishlistItem.deleteOne({
                movie: {imdbId: movie.imdbId, tmdbId: movie.tmdbId},
                user: {id: user.id}
            }).then(() => {
                return res.send({
                    flashMessageBag: [{msg: 'Movie has been removed from wish list.'}],
                    isWishlistItem: false,
                });
            })
        })
    })
}

exports.get = (req, res) => {
    User.findOne({email: req.params.token.username}).then(user => {
        WishlistItem.find({user: {id: user.id}}).then(wishlistItems => {

            let promises = []
            let apiMovies = []

            wishlistItems.forEach(item => {
                promises.push(
                    tmdb.api.get(`/movie/${item.movie.tmdbId}?api_key=` + process.env.TMDB_API_KEY).then(apiRes => {
                        // console.log(apiRes.data);
                        apiMovies.push(apiRes.data)
                    })
                )
            })

            Promise.all(promises).then(() => {
                return res.status(200).send({
                    wishlistItems: apiMovies
                })
            })
        })
    })
}
