import {api} from './Api'

const login = params => {
    return api.post('/login', params, {})
}

const register = params => {
    return api.post('/register', params)
}

const account = () => {
    return api.get('/account')
}

const updateAccount = params => {
    return api.post('/account/update', params)
}

const verifyToken = params => {
    return api.post('/account/token/verify', params)
}

export {login, register, account, verifyToken}
