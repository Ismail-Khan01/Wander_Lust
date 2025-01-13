const listing = require("../models/listing");
const reviews = require("../models/review.js")
module.exports.newReview = async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    const Review = new reviews(req.body.review);
    Review.author = req.user._id
    list.reviews.push(Review);
    await list.save()
    await Review.save()
    req.flash("success", "New review got added");
    res.redirect(`/listings/${id}`)
}
module.exports.destroyReview = async (req, res) => {
    const { id, reviewid } = req.params;
    const list = await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } })
    const review = await reviews.findByIdAndDelete(reviewid)
    req.flash("success", "Review got Deleted")
    res.redirect(`/listings/${id}`)

}