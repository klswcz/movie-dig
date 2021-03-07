import {api} from './Api'

const create = params => {
    return api.post('/wishlist', params)
}

const destroy = params => {
    return api.delete('/wishlist', params)
}

const get = params => {
    return api.get('/wishlist')
}

export {create, destroy, get}
