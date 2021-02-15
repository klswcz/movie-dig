import axios from 'axios'
// import store from '../store/reducer'

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

const api = axios.create({
    baseURL: `http://localhost:8081`
})

// TODO: Authorization token is not being set for requests that are made when page is initially loading
api.interceptors.response.use(response => {

    if (response.config.url === '/login') { // update Authorization header after successful login
        api.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
    }

    // store.dispatch({type: 'HIDE_ALERT'});

    return response
}, error => {
    if (error.response.status === 401) {
        localStorage.setItem('token', null)
        window.location.reload()
    }

    // let errors = []
    //
    // if (err.response.data.errors) {
    //     err.response.data.errors.forEach(e => errors.push(e.msg))
    // } else if (err.response.data.message) {
    //     errors = [err.response.data.message]
    // } else {
    //     errors = [err.response.statusText]
    // }
    // store.dispatch({type: 'SHOW_ALERT', payload: errors})

    return Promise.reject(error)
})

export {api}
