const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require('../models/review.js')
const Listing = require('../models/listings'); // Check if the path is correct

const {
  validateReview,
   isLoggedIn ,
   isReviewAuthor
  } = require("../middleware.js")


const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");

//Reviews
//Post
router.post("/" , 
  isLoggedIn,
  validateReview ,wrapAsync (reviewController.createReview));
   
   //delete Route Reviews
   router.delete(
       "/:reviewId",
       isLoggedIn,
       isReviewAuthor,
       wrapAsync(reviewController.destroyReview)
     );

     module.exports = router;