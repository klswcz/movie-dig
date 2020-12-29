import {createStore} from 'redux'

const initialState = {
    alert: {
        isVisible: false,
        messageBag: []
    },
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
        case 'LOGOUT':
            return {
                ...state,
                userEmail: ''
            }
        default:
            return {
                ...state
            }
    }
}

export default createStore(rootReducer);
