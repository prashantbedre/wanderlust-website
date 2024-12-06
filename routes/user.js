const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router = express.Router();
const {saveRedirectUrl} = require("../middleware.js")

const userController = require("../controllers/users.js");


router
 .route("/signup")
 .get(userController.renderForm)
 .post(
    wrapAsync(userController.signUp));


router
 .route("/login" )
 .get( userController.renderLoginForm)
 .post(
    saveRedirectUrl ,
     passport.authenticate("local", {
        failureRedirect:"/login" ,
        failureFlash: true
     }),
     userController.login);

router

router.get("/logout" , userController.logout);

module.exports = router;

