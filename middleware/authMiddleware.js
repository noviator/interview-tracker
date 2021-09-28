//------------TO HANDLE PROTECTED ROUTES--------------//
// checks jwt , cookies sent back to server on every request and restrict page access accordingly ie. if valid ->goto page else ->redirect to login//
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt; // here jwt is the cookie name ;
    //checking if the web token exists and verifying it
    if (token) {
        // here jwt is the package and the 'secret' is the string we are setting while creating tokens using createTokens function in authController.js
        jwt.verify(token, "a secret string ", (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect("/login"); //if token exists in browser and is invalid/tampered redirect to login page
            } else {
                // console.log(decodedToken);
                next(); // --> move onto next middleware
            }
        });
    } else {
        res.redirect("/login"); // if token dosent exists redirect to login page
    }
};

// checking cookies for the details of curret user to output their email,name etc.. in the views if logged in
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt; // get tocken from cookies;
    if (token) {
        jwt.verify(token, "a secret string ", async(err, decodedToken) => {
            if (err) {
                // let user;
                // console.log(err);
                res.locals.user = null; // explained below
                next();
            } else {
                // console.log(decodedToken); // inside decoded token we have we have id which we passed into the function when creating tokens using createTokens in the authController.js
                let user = await User.findById(decodedToken.id); //finding user by the decoded token inside id and storing all prop of user in the 'user' object
                res.locals.user = user; //to make the user object accessible from the views (where we can access its prop like id, email etc..)
                // console.log(res.locals);
                // console.log(res.locals.user);
                next(); // --> move onto next middleware
            }
        });
    } else {
        //if the token dosent exist
        res.locals.user = null;
        next();
    }
};

module.exports = { requireAuth, checkUser };