const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    movieId: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    },
    timestamp: {
        type: String,
        required: true
    }
});

const Rating = mongoose.model("Rating", RatingSchema);
module.exports = Rating;
