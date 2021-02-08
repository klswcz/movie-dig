import {api} from './Api'

const get = params => {
    return api.get(`/rating/user/${params.movieId}`, params)
}

const set = params => {
    return api.post('/rating/user/update', params)
}

export {get, set}
