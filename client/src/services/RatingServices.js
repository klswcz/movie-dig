import {api} from './Api'

const get = params => {
    return api.get(`/rating/${params.movieId}`, params)
}

const set = params => {
    return api.patch('/rating/', params)
}

const destroy = params => {
    return api.delete('/rating', params)
}

export {get, set, destroy}
