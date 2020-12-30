import {api} from './Api'

const trending = params => {
    return api.get('/movies/trending')
}

export {trending}
