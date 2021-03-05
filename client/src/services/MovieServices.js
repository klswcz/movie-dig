import {api} from './Api'

const trending = params => {
    return api.get('/movies/trending')
}

const recommendation = params => {
    return api.get('movies/recommendation')
}

const movieInfo = params => {
    return api.get(`/movies/${params.movieId}`)
}

export {trending, movieInfo, recommendation}
