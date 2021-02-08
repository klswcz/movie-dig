import {api} from './Api'

const create = params => {
    return api.post('/wishlist/add', params)
}

const destroy = params => {
    return api.post('/wishlist/delete', params)
}

export {create, destroy}
