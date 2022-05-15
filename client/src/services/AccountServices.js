import { api } from "./Api"

const get = () => {
    return api.get("/account")
}

const update = (params) => {
    return api.patch("/account", params)
}

const updatePassword = (params) => {
    return api.post("/account/password", params)
}

const destroy = () => {
    return api.delete("/account")
}

export { get, update, updatePassword, destroy }
