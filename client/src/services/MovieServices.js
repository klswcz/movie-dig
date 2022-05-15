import { api } from "./Api"

const get = (params) => {
    return api.get(`/movies/${params.id}`)
}

const trending = () => {
    return api.get("/movies/trending")
}

const topRated = () => {
    return api.get("/movies/top-rated")
}

const popular = () => {
    return api.get("/movies/popular")
}

const topThrillers = () => {
    return api.get("/movies/top/53")
}

const topComedies = () => {
    return api.get("/movies/top/35")
}

const topRomances = () => {
    return api.get("movies/top/10749")
}

const recommendation = (params) => {
    return api.get("/movies/recommendations", { params })
}

const getSimilar = (params) => {
    return api.get(`/movies/${params.id}/similar`)
}

const search = (params) => {
    return api.get("movies/search", { params })
}

export { trending, topRated, popular, get, recommendation, search, topThrillers, topRomances, topComedies, getSimilar }
