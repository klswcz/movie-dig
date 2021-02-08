import {api} from './Api'

const get = params => {
    return api.get(`/rating/user/${params.movieId}`, params)
}

const set = params => {
    return api.post('/rating/user/update', params)
}

const destroy = params => {
    return api.post('/rating/user/delete', params)
}

export {get, set, destroy}
