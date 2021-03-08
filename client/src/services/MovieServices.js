import {api} from './Api'

const get = params => {
    return api.get(`/movies/${params.movieId}`)
}

const trending = params => {
    return api.get('/movies/trending')
}

const recommendation = params => {
    return api.get('movies/recommendation')
}

const search = params => {
    return api.get('movies/search', {
        params: params
    })
}

export {trending, get, recommendation, search}
