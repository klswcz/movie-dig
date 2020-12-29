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
        case 'SET_USER_EMAIL':
            return {
                ...state,
                userEmail: 'damian@test.com'
            }
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.payload
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

export default createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
