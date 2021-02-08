const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    imdbId: {
        type: String,
    },
    tmdbId: {
        type: String,
        required: true
    }
});

const Movie = mongoose.model("Movie", MovieSchema);
module.exports = Movie;
