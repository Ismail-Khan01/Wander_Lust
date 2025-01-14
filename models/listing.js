const mongoose = require('mongoose');
const { Schema } = mongoose
const review = require("./review.js");
const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
})
listingSchema.post("findOneAndDelete", async (list) => {
    if (list) {

        const deletedReview = await review.deleteMany({ _id: { $in: list.reviews } })
        console.log(deletedReview)
    }

})
const list = mongoose.model("listing", listingSchema);

module.exports = list;