const axios = require("axios")

exports.api = axios.create({
    baseURL: `https://api.themoviedb.org/3`
})
