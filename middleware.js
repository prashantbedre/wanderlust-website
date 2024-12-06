const Listing = require("./models/listings");
const ExpressError = require("./utils/ExpressErr.js");
const {listingSchema , reviewSchema } = require("./schema.js");
const review = require("./models/review.js");
const Review = require('./models/review.js')



module.exports.isLoggedIn = (req, res , next) => {
   if(!req.isAuthenticated()) {
      //redirectUrl save
      req.session.redirectUrl = req.originalUrl;
    req.flash("error" , "you must be logged in to create a listing");
    return res.redirect("/login");
   }
   next();
};

//Redirect on as user goes on path
module.exports.saveRedirectUrl = (req , res , next) => {
   if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
   }
   next();
};

module.exports.isOwner = async(req, res, next) => {
   let {id} = req.params;
   let listing = await Listing.findById(id);
   if(!listing.owner.equals(res.locals.currUser._id)){
       req.flash("error", "You are not a owner of this listing")
       return  res.redirect(`/listings/${id}`);
   }
   next();
};


module.exports.validateListing = (req, res , next) => {
   let {error} = listingSchema.validate(req.body);
   if(error){
     throw new ExpressError(400 , error);
   }else{
       next();
   };
};

module.exports.validateReview = (req, res , next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
      throw new ExpressError(400 , error);
    }else{
        next();
    };
};

module.exports.isReviewAuthor = async(req, res, next) => {
   let {id , reviewId} = req.params;
   let review = await Review.findById(reviewId);
   if(!review.author.equals(res.locals.currUser._id)){
       req.flash("error", "You are not a author of this listing")
       return  res.redirect(`/listings/${id}`);
   }
   next();
};

