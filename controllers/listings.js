const Listing = require("../models/listings");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListing= await Listing.find({});
    res.render("./listings/index.ejs" , {allListing})
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews" ,populate:{
        path:"author"
    }})
    .populate("owner");
    if(!listing){
        req.flash("error" , " Listing  you requested for does not exist! ")
        res.redirect("/listings")
    }
    console.log(listing)
    res.render("./listings/show.ejs" , {listing})
};

module.exports.createNewListing = async (req, res, next) => {
    try {
        // Fetch geolocation
        const response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1
            })
            .send();

        // Validate geocoding response
        if (!response.body.features || response.body.features.length === 0) {
            req.flash("error", "Could not fetch geolocation for the provided address.");
            return res.redirect("/listings/new");
        }

        const geometry = response.body.features[0].geometry;

        if (!geometry || !geometry.type || !geometry.coordinates) {
            req.flash("error", "Invalid geometry data returned from geocoding service.");
            return res.redirect("/listings/new");
        }

        // Create new listing
        const url = req.file.path;
        const filename = req.file.filename;
        const newListing = new Listing(req.body.listing);

        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = geometry;

        // Save listing to database
        const savedListing = await newListing.save();
        console.log("Saved Listing:", savedListing);

        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (error) {
        console.error("Error creating listing:", error);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/listings/new");
    }
};


module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , " Listing  you requested for does not exist! ")
        res.redirect("/listings")
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl  = originalImageUrl.replace("/upload" , "/upload/h_300,w_250");
    res.render("./listings/edit.ejs" , {listing , originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400 , " send valid data listing");
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id ,{...req.body.listing});
    
    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }
     req.flash("success" , " Listing Updated !");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listings")
    
};