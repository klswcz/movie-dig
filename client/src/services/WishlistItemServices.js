import { api } from "./Api"

const get = () => {
    return api.get("/wishlist")
}

const create = (params) => {
    return api.post("/wishlist", params)
}

const destroy = (params) => {
    return api.delete("/wishlist", { params })
}

export { create, destroy, get }
