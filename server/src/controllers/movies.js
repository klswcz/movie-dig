const tmdb = require("../services/TmdbApi")
const User = require("../models/User")
const Movie = require("../models/Movie")
const WishlistItem = require("../models/WishlistItem")
const Rating = require("../models/Rating")
const { spawn } = require("child_process")
const mongoose = require("mongoose")
const Types = mongoose.Types

exports.trending = (req, res, next) => {
    const movies = []
    const promises = []

    tmdb.api.get("/trending/movie/week?api_key=" + process.env.TMDB_API_KEY).then((apiResponse) => {
        User.findOne({ email: req.params.token.email }).then((user) => {
            apiResponse.data.results.forEach((movie, index) => {
                promises.push(
                    new Promise((resolve) => {
                        Movie.findOne({ tmdb_id: movie.id }).then((movieModel) => {
                            Rating.findOne({
                                user_id: user.id,
                                movie_id: movieModel ? movieModel.movie_id : null
                            }).then((rating) => {
                                apiResponse.data.results[index].user_rating = rating ? rating.rating : null
                                movies.push(apiResponse.data.results[index])
                                resolve()
                            })
                        })
                    })
                )
            })

            Promise.all(promises).then(() => {
                return res.status(200).json({
                    movies: movies
                })
            })
        })
    })
}

exports.topRated = (req, res, next) => {
    const movies = []
    const promises = []

    tmdb.api.get("/movie/top_rated?api_key=" + process.env.TMDB_API_KEY).then((apiResponse) => {
        User.findOne({ email: req.params.token.email }).then((user) => {
            apiResponse.data.results.forEach((movie, index) => {
                promises.push(
                    new Promise((resolve) => {
                        Movie.findOne({ tmdb_id: movie.id }).then((movieModel) => {
                            Rating.findOne({
                                user_id: user.id,
                                movie_id: movieModel ? movieModel.movie_id : null
                            }).then((rating) => {
                                apiResponse.data.results[index].user_rating = rating ? rating.rating : null
                                movies.push(apiResponse.data.results[index])
                                resolve()
                            })
                        })
                    })
                )
            })

            Promise.all(promises).then(() => {
                return res.status(200).json({
                    movies: movies
                })
            })
        })
    })
}

exports.popular = (req, res, next) => {
    const movies = []
    const promises = []

    tmdb.api.get("/movie/popular?api_key=" + process.env.TMDB_API_KEY).then((apiResponse) => {
        User.findOne({ email: req.params.token.email }).then((user) => {
            apiResponse.data.results.forEach((movie, index) => {
                promises.push(
                    new Promise((resolve) => {
                        Movie.findOne({ tmdb_id: movie.id }).then((movieModel) => {
                            Rating.findOne({
                                user_id: user.id,
                                movie_id: movieModel ? movieModel.movie_id : null
                            }).then((rating) => {
                                apiResponse.data.results[index].user_rating = rating ? rating.rating : null
                                movies.push(apiResponse.data.results[index])
                                resolve()
                            })
                        })
                    })
                )
            })

            Promise.all(promises).then(() => {
                return res.status(200).json({
                    movies: movies
                })
            })
        })
    })
}

exports.topMovies = (req, res, next) => {
    const movies = []
    const promises = []

    tmdb.api
        .get(
            `/discover/movie?with_genres=${req.params.genre_id}&vote_count.gte=1000&sort_by=vote_average.desc&vote_count.gte=10000&with_original_language=en&api_key=${process.env.TMDB_API_KEY}`
        )
        .then((apiResponse) => {
            User.findOne({ email: req.params.token.email }).then((user) => {
                apiResponse.data.results.forEach((movie, index) => {
                    promises.push(
                        new Promise((resolve) => {
                            Movie.findOne({ tmdb_id: movie.id }).then((movieModel) => {
                                Rating.findOne({
                                    user_id: user.id,
                                    movie_id: movieModel ? movieModel.movie_id : null
                                }).then((rating) => {
                                    apiResponse.data.results[index].user_rating = rating ? rating.rating : null
                                    movies.push(apiResponse.data.results[index])
                                    resolve()
                                })
                            })
                        })
                    )
                })

                Promise.all(promises).then(() => {
                    return res.status(200).json({
                        movies: movies
                    })
                })
            })
        })
}

exports.recommendations = (req, res, next) => {
    User.findOne({ email: req.params.token.email }).then((user) => {
        Rating.find({ user_id: user.id }).then((ratings) => {
            if (ratings.length >= 20) {
                runRecommendationScript(user.id, req.query.count).then(
                    (recommendations) => {
                        const apiPromises = []
                        const mongoPromises = []
                        const recommendedMovies = []
                        recommendations = JSON.parse(recommendations)
                        const recommendationJson = []

                        for (let i = 0; i < Object.keys(recommendations.movie_id).length; i++) {
                            recommendationJson.push({
                                movie_id: recommendations.movie_id[i],
                                tmdb_id: recommendations.tmdb_id[i],
                                weighted_avg_recommend_score: recommendations.weighted_avg_recommend_score[i]
                            })
                        }

                        recommendationJson.forEach((movie) => {
                            apiPromises.push(
                                tmdb.api
                                    .get(`/movie/${movie.tmdb_id}?api_key=${process.env.TMDB_API_KEY}`)
                                    .then((apiResponse) => {
                                        recommendedMovies.push(apiResponse.data)
                                    })
                                    .catch((err) => {})
                            )
                        })

                        Promise.all(apiPromises).then(() => {
                            User.findOne({ email: req.params.token.email }).then((user) => {
                                recommendedMovies.forEach((movie, index) => {
                                    mongoPromises.push(
                                        new Promise((resolve) => {
                                            Movie.findOne({ tmdb_id: movie.id }).then((movieModel) => {
                                                Rating.findOne({
                                                    user_id: user.id,
                                                    movie_id: movieModel ? movieModel.movie_id : null
                                                }).then((rating) => {
                                                    recommendedMovies[index].user_rating = rating ? rating.rating : null
                                                    resolve()
                                                })
                                            })
                                        })
                                    )
                                })
                                Promise.all(mongoPromises).then(() => {
                                    return res.status(200).json({
                                        movies: recommendedMovies
                                    })
                                })
                            })
                        })
                    },
                    (err) => {
                        return res.status(400).json({
                            messageBag: [{ msg: "An error occurred while generating the recommendations." }]
                        })
                    }
                )
            } else {
                return res.status(200).json({
                    movies: null,
                    ratings_required: 20,
                    ratings_given: ratings.length
                })
            }
        })
    })
}

exports.get = (req, res, next) => {
    const promise = new Promise((resolve) => {
        User.findOne({ email: req.params.token.email }).then((user) => {
            Movie.findOne({ tmdb_id: req.params.id }).then((movie) => {
                if (movie === null) {
                    const movieModel = new Movie({
                        movie_id: new Types.ObjectId().toString(),
                        imdb_id: null,
                        tmdb_id: req.params.id
                    })

                    movieModel.save().then(() => {
                        movie = movieModel
                        resolve()
                    })
                } else {
                    WishlistItem.findOne({
                        movie: { movie_id: movie.movie_id, imdb_id: movie.imdb_id, tmdb_id: movie.tmdb_id },
                        user: { id: user.id }
                    }).then((item) => {
                        resolve(item !== null)
                    })
                }
            })
        })
    })

    promise.then((isWishlistItem) => {
        tmdb.api
            .get(`/movie/${req.params.id}?api_key=${process.env.TMDB_API_KEY}`)
            .then((movieRes) => {
                tmdb.api
                    .get(`/movie/${req.params.id}/credits?api_key=${process.env.TMDB_API_KEY}`)
                    .then((creditsRes) => {
                        movieRes.data.credits = creditsRes.data
                        return res.status(200).json({
                            movie: movieRes.data,
                            isWishlistItem: isWishlistItem
                        })
                    })
            })
            .catch(() => {
                return res.status(404).json({})
            })
    })
}

exports.getSimilar = (req, res, next) => {
    const movies = []
    const promises = []

    tmdb.api.get(`/movie/${req.params.id}/recommendations?api_key=` + process.env.TMDB_API_KEY).then((apiResponse) => {
        User.findOne({ email: req.params.token.email }).then((user) => {
            apiResponse.data.results.forEach((movie, index) => {
                promises.push(
                    new Promise((resolve) => {
                        Movie.findOne({ tmdb_id: movie.id }).then((movieModel) => {
                            Rating.findOne({
                                user_id: user.id,
                                movie_id: movieModel ? movieModel.movie_id : null
                            }).then((rating) => {
                                apiResponse.data.results[index].user_rating = rating ? rating.rating : null
                                movies.push(apiResponse.data.results[index])
                                resolve()
                            })
                        })
                    })
                )
            })

            Promise.all(promises).then(() => {
                return res.status(200).json({
                    movies: movies
                })
            })
        })
    })
}

exports.search = (req, res, next) => {
    tmdb.api
        .get(`/search/movie?query=${req.query.query}&api_key=` + process.env.TMDB_API_KEY)
        .then((apiResponse) => {
            return res.status(200).json({
                results: apiResponse.data.results.splice(0, 7)
            })
        })
        .catch(() => {
            return res.status(422).json({})
        })
}

const runRecommendationScript = async (userId, moviesCount = 20) => {
    const child = spawn("python3", ["src/scripts/recommendation.py", userId, moviesCount, process.env.DB_HOST])

    let data = ""
    for await (const chunk of child.stdout) {
        data += chunk
    }
    let error = ""
    for await (const chunk of child.stderr) {
        error += chunk
    }
    const exitCode = await new Promise((resolve, reject) => {
        child.on("close", resolve)
    })

    if (exitCode) {
        throw new Error(`subprocess error exit ${exitCode}, ${error}`)
    }
    return data
}
