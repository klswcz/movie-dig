import axios from 'axios'
import store from '../store/reducer'

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL
})

api.interceptors.response.use(response => {

    // Hide old messages
    store.dispatch({type: 'HIDE_ALERT'});
    store.dispatch({type: 'HIDE_FLASH_MESSAGE'});

    updateAuthToken(response)
    showResponseMessages(response)

    return response
}, error => {
    if (error.response) {
        switch (error.response.status) {
            case 401:
                localStorage.setItem('token', null)
                window.location.reload()
                break
            case 400:
            case 500:
                showResponseMessages(error.response)
                break
            default:
                // localStorage.setItem('token', null)
                // window.location.reload()
        }
    } else {
        store.dispatch({
            type: 'SHOW_ALERT',
            payload: [{msg: "There was an error while processing you request, please try again later."}]
        })
    }

    return Promise.reject(error)
})

const showResponseMessages = (response) => {
    if (response.data.messageBag) {
        store.dispatch({type: 'SHOW_ALERT', payload: response.data.messageBag})
    } else if (response.data.flashMessageBag) {
        store.dispatch({type: 'SHOW_FLASH_MESSAGE', payload: response.data.flashMessageBag})
    }
}

const updateAuthToken = (response) => {
    if (response.config.url === '/account/login' || (response.config.url === '/account' && response.config.method === 'patch')) {
        api.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
    }
}

export {api}
