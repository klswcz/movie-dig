import {api} from './Api'

const get = () => {
    return api.get('/account')
}

const update = params => {
    return api.post('/account', params)
}

const destroy = () => {
    return api.post('/account/delete')
}

export {get, update}
