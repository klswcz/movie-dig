import {api} from './Api'

const login = params => {
    return api.post('/account/login', params)
}

const register = params => {
    return api.post('/account', params)
}

export {login, register}
