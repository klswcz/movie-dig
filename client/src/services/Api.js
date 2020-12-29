import axios from 'axios'
import store from '../store/reducer'

const api = axios.create({
    baseURL: `http://localhost:8081`
})

api.interceptors.request.use(request => {
    api.defaults.headers.common['Authorization'] = 'Bearer ' + store.getState().token
    return request;
})
// TODO: Authorization token is not being set for requests that are made when page is initially loading
api.interceptors.response.use(response => {
    store.dispatch({type: 'HIDE_ALERT'});
    return response
}, res => {
    let errors = []

    if (res.response.data.errors) {
        res.response.data.errors.forEach(e => errors.push(e.msg))
    } else if (res.response.data.message) {
        errors = [res.response.data.message]
    } else {
        errors = [res.response.statusText]
    }
    store.dispatch({type: 'SHOW_ALERT', payload: errors})
    return Promise.reject(res)
})

export {api}