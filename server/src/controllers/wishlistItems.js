const WishlistItem = require("../models/WishlistItem")
const Movie = require("../models/Movie")
const User = require("../models/User")
const Rating = require("../models/Rating")
const tmdb = require("../services/TmdbApi")
const mongoose = require("mongoose")
const Types = mongoose.Types

exports.store = (req, res) => {
    User.findOne({ email: req.params.token.email }).then((user) => {
        Movie.findOne({ tmdb_id: req.body.movie_id }).then((movie) => {
            if (movie === null) {
                const movieModel = new Movie({
                    movie_id: new Types.ObjectId().toString(),
                    imdb_id: null,
                    tmdb_id: req.body.movie_id
                })

                movieModel.save().then(() => {
                    movie = movieModel
                })
            }
            WishlistItem.findOne({
                movie: { imdb_id: movie.imdb_id, tmdb_id: movie.tmdb_id },
                user: { id: user.id }
            }).then((item) => {
                if (item) {
                    return res.send({
                        flashMessageBag: [{ msg: "Movie already added to the wishlist." }],
                        isWishlistItem: true
                    })
                } else {
                    const wishlistItemModel = new WishlistItem({
                        movie: {
                            movie_id: movie.movie_id,
                            imdb_id: movie.imdb_id,
                            tmdb_id: movie.tmdb_id
                        },
                        user: {
                            id: user.id
                        }
                    })

                    wishlistItemModel.save(() => {
                        return res.send({
                            flashMessageBag: [{ msg: "Movie has been added to wish list." }],
                            isWishlistItem: true
                        })
                    })
                }
            })
        })
    })
}

exports.destroy = (req, res) => {
    User.findOne({ email: req.params.token.email }).then(() => {
        Movie.findOne({ tmdb_id: req.query.movie_id }).then((movie) => {
            WishlistItem.findOne({
                movie: {
                    movie_id: movie.movie_id,
                    imdb_id: movie.imdb_id,
                    tmdb_id: movie.tmdb_id
                }
            }).then((wishlistItem) => {
                wishlistItem.remove().then(() => {
                    return res.send({
                        flashMessageBag: [{ msg: "Movie has been removed from wish list." }],
                        isWishlistItem: false
                    })
                })
            })
        })
    })
}

exports.get = (req, res) => {
    User.findOne({ email: req.params.token.email }).then((user) => {
        WishlistItem.find({ user: { id: user.id } }).then((wishlistItems) => {
            const promises = []
            const apiMovies = []

            wishlistItems.forEach((item) => {
                promises.push(
                    tmdb.api
                        .get(`/movie/${item.movie.tmdb_id}?api_key=` + process.env.TMDB_API_KEY)
                        .then((apiResponse) => {
                            return Rating.findOne({ user_id: user.id, movie_id: item.movie.movie_id }).then(
                                (rating) => {
                                    apiResponse.data.user_rating = rating ? rating.rating : null
                                    apiMovies.push(apiResponse.data)
                                }
                            )
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
