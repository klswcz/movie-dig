import {api} from './Api'

const get = params => {
    return api.get(`/movies/${params.id}`)
}

const trending = params => {
    return api.get('/movies/trending')
}

const topRated = params => {
    return api.get('/movies/top-rated')
}

const popular = params => {
    return api.get('/movies/popular')
}

const topThrillers = params => {
    return api.get('/movies/top/53')
}

const topComedies = params => {
    return api.get('/movies/top/35')
}

const topRomances = params => {
    return api.get('movies/top/10749')
}

const recommendation = params => {
    return api.get('/movies/recommendations', {params})
}

const search = params => {
    return api.get('movies/search', {params})
}

export {trending, topRated, popular, get, recommendation, search, topThrillers, topRomances, topComedies}
