import {api} from './Api'

const create = params => {
    return api.post('/wishlist/add', params)
}

export {create}
