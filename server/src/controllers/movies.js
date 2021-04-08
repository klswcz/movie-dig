const tmdb = require('../services/TmdbApi')
const User = require("../models/User");
const Movie = require("../models/Movie");
const WishlistItem = require("../models/WishlistItem");
const Rating = require("../models/Rating");
const {spawn} = require('child_process');
const mongoose = require("mongoose");
const Types = mongoose.Types;

exports.trending = (req, res, next) => {
    let movies = []
    let promises = []

    tmdb.api.get('/trending/movie/week?api_key=' + process.env.TMDB_API_KEY).then(apiResponse => {
        User.findOne({email: req.params.token.email}).then(user => {
            apiResponse.data.results.forEach((movie, index) => {
                promises.push(new Promise(resolve => {
                    Movie.findOne({tmdb_id: movie.id}).then(movieModel => {
                        Rating.findOne({
                            user_id: user.id,
                            movie_id: movieModel ? movieModel.movie_id : null
                        }).then(rating => {
                            apiResponse.data.results[index].user_rating = rating ? rating.rating : null
                            movies.push(apiResponse.data.results[index])
                            resolve()
                        })
                    })
                }))
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

    runRecommendationScript().then(
        recommendations => {
            let promises = []
            let tmdbApiResponses = []

            recommendations = recommendations.split(",")
            recommendations = recommendations.slice(0, recommendations.length - 1)

            recommendations.forEach(tmdbId => {
                promises.push(
                    tmdb.api.get(`/movie/${tmdbId}?api_key=${process.env.TMDB_API_KEY}`).then(apiResponse => {
                        tmdbApiResponses.push(apiResponse.data)
                    })
                )
            })

            Promise.all(promises).then(() => {
                return res.status(200).json({
                    movies: tmdbApiResponses
                })
            })
        },
        err => {
            return res.status(400).json({
                messageBag: [{msg: 'An error occurred while generating the recommendations.'}]
            });
        }
    );
}

exports.get = (req, res, next) => {

    const promise = new Promise(((resolve) => {
        User.findOne({email: req.params.token.email}).then(user => {
            Movie.findOne({tmdb_id: req.params.id}).then(movie => {

                if (movie === null) {
                    let movieModel = new Movie({
                        movie_id: (new Types.ObjectId).toString(),
                        imdb_id: null,
                        tmdb_id: req.params.id
                    })

                    movieModel.save().then(() => {
                        movie = movieModel;
                        resolve()
                    })
                } else {
                    WishlistItem.findOne({
                        movie: {movie_id: movie.movie_id, imdb_id: movie.imdb_id, tmdb_id: movie.tmdb_id},
                        user: {id: user.id}
                    }).then(item => {
                        resolve(item !== null)
                    })
                }
            })
        })
    }))

    promise.then((isWishlistItem) => {
        tmdb.api.get(`/movie/${req.params.id}?api_key=${process.env.TMDB_API_KEY}`).then(movieRes => {
            tmdb.api.get(`/movie/${req.params.id}/credits?api_key=${process.env.TMDB_API_KEY}`).then(creditsRes => {
                movieRes.data.credits = creditsRes.data
                return res.status(200).json({
                    movie: movieRes.data,
                    isWishlistItem: isWishlistItem
                })
            })
        }).catch(() => {
            return res.status(404).json({})
        })
    })
}

exports.search = (req, res, next) => {
    tmdb.api.get(`/search/movie?query=${req.query.query}&api_key=` + process.env.TMDB_API_KEY).then(apiResponse => {
        return res.status(200).json({
            results: apiResponse.data.results.splice(0, 7)
        })
    }).catch(() => {
        return res.status(422).json({})
    })
}

const runRecommendationScript = async () => {
    const child = spawn('python3', ["src/scripts/recommendation.py"]);

    let data = "";
    for await (const chunk of child.stdout) {
        data += chunk;
    }
    let error = "";
    for await (const chunk of child.stderr) {
        error += chunk;
    }
    const exitCode = await new Promise((resolve, reject) => {
        child.on('close', resolve);
    });

    if (exitCode) {
        throw new Error(`subprocess error exit ${exitCode}, ${error}`);
    }
    return data;
}
