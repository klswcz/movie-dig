import {api} from './Api'

const get = params => {
    return api.get(`/ratings/${params.movie_id}`)
}

const create = params => {
    return api.post('/ratings', params)
}

const update = params => {
    return api.patch('/ratings', params)
}

const destroy = params => {
    return api.delete('/ratings', {params})
}

const count = params => {
    return api.get('/ratings/count', {params})
}

export {get, update, destroy, count, create}
