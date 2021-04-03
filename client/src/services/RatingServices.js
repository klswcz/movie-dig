import {api} from './Api'

const get = params => {
    return api.get(`/rating/${params.movie_id}`, params)
}

const update = params => {
    return api.patch('/rating/', params)
}

const destroy = params => {
    return api.delete('/rating', {
        params: params
    })
}

const count = params => {
    return api.get('/rating/count', {
        params: params
    })
}

export {get, update, destroy, count}
