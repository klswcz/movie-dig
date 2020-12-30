const tmdb = require('../services/TmdbApi')

exports.trending = (req, res, next) => {
    tmdb.api.get('/trending/movies/week?api_key=' + process.env.TMDB_API_KEY).then(apiRes => {
        return res.status(200).json({
            movies: apiRes.data.results
        })
    })
}
