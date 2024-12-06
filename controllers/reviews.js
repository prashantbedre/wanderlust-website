const Listing =require("../models/listings");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let listing =  await  Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
     listing.reviews.push(newReview);
   
     await newReview.save();
     req.flash("success" , "New Review Created!");
     await listing.save();
   
     res.redirect(`/listings/${listing._id}`);
   
   };

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;

    // Pull the reviewId from the reviews array in the Listing document
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review document by reviewId
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted");
    // Redirect back to the listing page
    res.redirect(`/listings/${id}`);
  };