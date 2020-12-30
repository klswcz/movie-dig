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

export {login, register, account}
