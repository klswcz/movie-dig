import axios from 'axios'
import store from '../store/reducer'

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

const api = axios.create({
    baseURL: `http://localhost:8081`
})

api.interceptors.response.use(response => {

    if (response.config.url === '/login') { // update Authorization header after successful login
        api.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
    }

    if (response.data.messageBag) {
        store.dispatch({type: 'SHOW_ALERT', payload: response.data.messageBag})
    } else if (response.data.flashMessageBag) {
        store.dispatch({type: 'SHOW_FLASH_MESSAGE', payload: response.data.flashMessageBag})
    }

    return response
}, error => {
    if (error.response.status === 401) {
        localStorage.setItem('token', null)
        window.location.reload()
    }

    // let errors = []
    //
    // if (error.response.data.errors) {
    //     error.response.data.errors.forEach(e => errors.push(e.msg))
    // } else if (error.response.data.message) {
    //     errors = [error.response.data.message]
    // } else {
    //     errors = [error.response.statusText]
    // }
    //
    // store.dispatch({type: 'SHOW_ALERT', payload: errors})

    return Promise.reject(error)
})

export {api}
