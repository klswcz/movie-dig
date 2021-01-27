const tmdb = require('../services/TmdbApi')

exports.trending = (req, res, next) => {
    tmdb.api.get('/trending/movie/week?api_key=' + process.env.TMDB_API_KEY).then(apiRes => {
        return res.status(200).json({
            movies: apiRes.data.results
        })
    })
}

exports.recommendations = (req, res, next) => {
    tmdb.api.get('/trending/movies/week?api_key=' + process.env.TMDB_API_KEY).then(apiRes => {
        return res.status(200).json({
            movies: apiRes.data.results
        })
    })
}

exports.getMovie = (req, res, next) => {
    const movieId = req.params[0];

    tmdb.api.get(`/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`).then(movieRes => {
        tmdb.api.get(`/movie/${movieId}/credits?api_key=${process.env.TMDB_API_KEY}`).then(creditsRes => {
            movieRes.data.credits = creditsRes.data
            return res.status(200).json({
                movie: movieRes.data
            })

        })
    })
}
