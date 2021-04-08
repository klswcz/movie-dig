import {api} from './Api'

const get = params => {
    return api.get(`/movies/${params.id}`)
}

const trending = params => {
    return api.get('/movies/trending')
}

const recommendation = params => {
    return api.get('movies/recommendations')
}

const search = params => {
    return api.get('movies/search', {params})
}

export {trending, get, recommendation, search}
