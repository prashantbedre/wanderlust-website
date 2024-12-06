const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listings'); // Check if the path is correct
const {isLoggedIn , isOwner ,validateListing} = require("../middleware.js");
const { populate } = require("../models/review.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const ListingController = require("../controllers/listings.js");
const { route } = require("./user.js");


router
  .route("/")
  .get(wrapAsync (ListingController.index))
  .post(
    isLoggedIn,
     upload.single("listing[image]"),
     validateListing ,
      wrapAsync (ListingController.createNewListing)
    );
  
//New Route
router.get("/new" , isLoggedIn , ListingController.renderNewForm);

//update route
router
 .route("/:id")
 .get(wrapAsync (ListingController.showListing))
 .put( 
    isLoggedIn, 
        isOwner,
        upload.single("listing[image]"),
        validateListing , wrapAsync (ListingController.updateListing)
    )
.delete( isLoggedIn,  isOwner, wrapAsync (ListingController.destroyListing));
         


//Edit Route
router.get("/:id/edit" ,
    isLoggedIn,
    isOwner,
     wrapAsync (ListingController.renderEditForm));


module.exports = router;