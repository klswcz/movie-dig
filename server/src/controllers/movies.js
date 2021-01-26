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
    console.log(`/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`);
    tmdb.api.get(`/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`).then(apiRes => {
        return res.status(200).json({
            movies: apiRes.data
        })
    })
}
