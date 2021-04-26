const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    movie_id: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    }
});

const Rating = mongoose.model("Rating", RatingSchema);
module.exports = Rating;
