const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
    movieId: {
        type: String,
    },
    imdbId: {
        type: String,
    },
    tmdbId: {
        type: String,
        required: true
    }
});

const Link = mongoose.model("Link", LinkSchema);
module.exports = Link;
