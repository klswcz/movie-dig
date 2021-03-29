import axios from 'axios'
import store from '../store/reducer'

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

const api = axios.create({
    baseURL: `http://localhost:8081`
})

api.interceptors.response.use(response => {
    store.dispatch({type: 'HIDE_ALERT'});
    store.dispatch({type: 'HIDE_FLASH_MESSAGE'});

    if (response.config.url === '/account/login' || (response.config.url === '/account' && response.config.method === 'post')) { // update Authorization header after successful login
        api.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
    }

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
                localStorage.setItem('token', null)
                window.location.reload()
        }
    } else {
        store.dispatch({type: 'SHOW_ALERT', payload: [{msg: "There was an error while processing you request, please try again later."}]})
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

export {api}
