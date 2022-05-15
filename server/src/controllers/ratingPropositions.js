const tmdb = require("../services/TmdbApi")
const Rating = require("../models/Rating")
const User = require("../models/User")
const Movie = require("../models/Movie")

exports.get = (req, res) => {
    const propositionsResponse = []
    const apiPromises = []
    const mongoPromises = []

    const movieGenres = [
        { id: 878, name: "Science Fiction" },
        { id: 53, name: "Thriller" },
        { id: 35, name: "Comedy" },
        { id: 10749, name: "Romance" }
    ]

    User.findOne({ email: req.params.token.email }).then((user) => {
        apiPromises.push(
            tmdb.api
                .get(
                    `/discover/movie?vote_count.gte=1000&sort_by=vote_average.desc&vote_count.gte=10000&with_original_language=en&api_key=${process.env.TMDB_API_KEY}`
                )
                .then((apiResponse) => {
                    propositionsResponse.push({
                        name: "Top rated",
                        movies: apiResponse.data.results.sort((a, b) => {
                            return b.vote_average - a.vote_average
                        })
                    })
                })
        )

        movieGenres.forEach((genre) => {
            apiPromises.push(
                tmdb.api
                    .get(
                        `/discover/movie?with_genres=${genre.id}&vote_count.gte=1000&api_key=${process.env.TMDB_API_KEY}`
                    )
                    .then((apiResponse) => {
                        propositionsResponse.push({
                            name: genre.name,
                            movies: apiResponse.data.results.sort((a, b) => {
                                return b.vote_average - a.vote_average
                            })
                        })
                    })
            )
        })

        Promise.all(apiPromises).then(() => {
            propositionsResponse.forEach((genre, genreIndex) => {
                genre.movies.forEach((movie, movieIndex) => {
                    mongoPromises.push(
                        new Promise((resolve) => {
                            Movie.findOne({ tmdb_id: movie.id }).then((movieModel) => {
                                Rating.findOne({
                                    user_id: user.id,
                                    movie_id: movieModel ? movieModel.movie_id : null
                                }).then((rating) => {
                                    if (rating !== null) {
                                        propositionsResponse[genreIndex].movies[movieIndex].user_rating = rating.rating
                                    } else {
                                        propositionsResponse[genreIndex].movies[movieIndex].user_rating = null
                                    }
                                    resolve()
                                })
                            })
                        })
                    )
                })
            })

            Promise.all(mongoPromises).then(() => {
                return res.status(200).json({
                    propositions: propositionsResponse
                })
            })
        })
    })
}
