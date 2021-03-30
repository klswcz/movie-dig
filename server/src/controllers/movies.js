const tmdb = require('../services/TmdbApi')
const User = require("../models/User");
const Movie = require("../models/Movie");
const WishlistItem = require("../models/WishlistItem");
const Rating = require("../models/Rating");
const {spawn} = require('child_process');
const mongoose = require("mongoose");
const Types = mongoose.Types;

exports.trending = (req, res, next) => {
    let movieResponse = []

    tmdb.api.get('/trending/movie/week?api_key=' + process.env.TMDB_API_KEY).then(apiRes => {
        User.findOne({email: req.params.token.username}).then(user => {
            apiRes.data.results.forEach((movie, index) => {
                Movie.findOne({tmdb_id: movie.id}).then(movieModel => {
                    Rating.findOne({user_id: user.id, movie_id: movieModel ? movieModel.id : null}).then(rating => {
                        if (rating !== null) {
                            apiRes.data.results[index].user_rating = rating.rating
                        }
                        movieResponse.push(apiRes.data.results[index])
                        if (movieResponse.length === apiRes.data.results.length) {
                            return res.status(200).json({
                                movies: movieResponse
                            })
                        }
                    })
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
                    tmdb.api.get(`/movie/${tmdbId}?api_key=${process.env.TMDB_API_KEY}`).then(apiRes => {
                        tmdbApiResponses.push(apiRes.data)
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
    const movieId = req.params[0];
    let isWishlistItem = false;

    User.findOne({email: req.params.token.username}).then(user => {
        Movie.findOne({tmdb_id: movieId}).then(movie => {

            if (movie === null) {
                let movieModel = new Movie({
                    movie_id: (new Types.ObjectId).toString(),
                    imdb_id: null,
                    tmdb_id: movieId
                })

                movieModel.save().then(error => {
                    movie = movieModel;
                })
            } else {
                WishlistItem.findOne({
                    movie: {movie_id: movie.movie_id, imdb_id: movie.imdb_id, tmdb_id: movie.tmdb_id},
                    user: {id: user.id}
                }).then(item => {
                    isWishlistItem = item !== null
                })
            }
        })
    })

    tmdb.api.get(`/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`).then(movieRes => {
        tmdb.api.get(`/movie/${movieId}/credits?api_key=${process.env.TMDB_API_KEY}`).then(creditsRes => {
            movieRes.data.credits = creditsRes.data
            return res.status(200).json({
                movie: movieRes.data,
                isWishlistItem: isWishlistItem
            })

        })
    })
}

exports.search = (req, res, next) => {

    User.findOne({email: req.params.token.username}).then(user => {
        tmdb.api.get(`/search/movie?query=${req.query.query}&api_key=` + process.env.TMDB_API_KEY).then(apiRes => {
            return res.status(200).json({
                results: apiRes.data.results
            })
        }).catch(err => {
            return res.status(400).json({
                results: err
            })
        })
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
