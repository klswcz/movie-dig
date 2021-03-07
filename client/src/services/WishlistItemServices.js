import {api} from './Api'

const create = params => {
    return api.post('/wishlist/add', params)
}

const destroy = params => {
    return api.post('/wishlist/delete', params)
}

const get = params => {
    return api.get('/wishlist')
}

export {create, destroy, get}
