import {createStore} from 'redux'

const initialState = {
    alert: {
        isVisible: false,
        messageBag: []
    },
    token: localStorage.getItem('token') || '',
    userEmail: '',
}
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'HIDE_ALERT':
            return {
                ...state,
                alert: {
                    isVisible: false,
                    messageBag: []
                }
            }
        case 'SHOW_ALERT':
            return {
                ...state,
                alert: {
                    isVisible: true,
                    messageBag: action.payload
                }
            }
        case 'AUTH_SUCCESS':
            return {
                ...state,
                token: 'success'
            }
        case 'SET_USER_EMAIL':
            return {
                ...state,
                userEmail: 'damian@test.com'
            }
        case 'LOGOUT':
            return {
                ...state,
                token: '',
                userEmail: ''
            }
        default:
            return {
                ...state
            }
    }
}

export default createStore(rootReducer);
