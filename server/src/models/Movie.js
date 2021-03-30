const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    movie_id: {
        type: String,
        required: true
    },
    imdb_id: {
        type: String,
    },
    tmdb_id: {
        type: String,
        required: true
    }
});

const Movie = mongoose.model("Movie", MovieSchema);
module.exports = Movie;
