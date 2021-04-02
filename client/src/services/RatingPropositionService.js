import {api} from './Api'

const get = params => {
    return api.get(`/rating-propositions`)
}

export {get}
