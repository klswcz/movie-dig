import {api} from './Api'

const get = params => {
    return api.get(`/rating-propositions`, {
        params: params
    })
}

export {get}
