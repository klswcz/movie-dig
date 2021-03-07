import {api} from './Api'

const get = () => {
    return api.get('/account')
}

const update = params => {
    return api.post('/account', params)
}

const updatePassword = params => {
    return api.post('/account/password', params)
}

const destroy = () => {
    return api.post('/account/delete')
}

export {get, update, updatePassword, destroy}
