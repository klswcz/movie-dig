import {createStore} from 'redux'

const initialState = {
    alert: {
        isVisible: false,
        messageBag: []
    },
    flashMessage: {
        isVisible: false,
        messageBag: []
    },
    userEmail: '',
    ratingCount: 0
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
        case 'HIDE_FLASH_MESSAGE':
            return {
                ...state,
                flashMessage: {
                    isVisible: false,
                    messageBag: []
                }
            }
        case 'SHOW_FLASH_MESSAGE':
            return {
                ...state,
                flashMessage: {
                    isVisible: true,
                    messageBag: action.payload
                }
            }
        case 'SET_RATING_COUNT':
            return {
                ...state,
                ratingCount: action.payload
            }
        default:
            return {
                ...state
            }
    }
}

export default createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
