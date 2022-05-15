const mongoose = require("mongoose")
const Schema = mongoose.Schema

const WishlistItemSchema = new Schema({
    movie: {
        type: Object,
        required: true
    },
    user: {
        type: Object,
        required: true
    }
})

const WishlistItem = mongoose.model("WishlistItem", WishlistItemSchema)
module.exports = WishlistItem
