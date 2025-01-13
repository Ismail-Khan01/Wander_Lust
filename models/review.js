const mongoose = require("mongoose");
const { max } = require("../schema");
const { Schema } = mongoose;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    created_At: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
})

const Review = mongoose.model("review", reviewSchema);
module.exports = Review