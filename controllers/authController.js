const User = require("../models/User");
const jwt = require("jsonwebtoken");
// const { create } = require("../models/User");
// const { use } = require("../routes/authRoutes");

const errorHandler = (err) => {
    // console.log(err.message, err.code);
    const errors = { userName: "", email: "", password: "", passwordConfirm: "" };
    // incorrect email error
    // "incorrect email" comes from the --->userSchema.statics.login<--- function of the User.js
    if (err.message === "incorrect email") {
        errors.email = "This email is not registered";
    }

    // incorrect password error
    // "incorrect password" comes from the --->userSchema.statics.login<--- function of the User.js
    if (err.message === "incorrect password") {
        errors.password = "This password is incorrect";
    }

    //password and passwordConfirm are not same
    if (err.message === "password confirm error") {
        errors.passwordConfirm = "Passwords dont match";
    }

    if (err.message.includes("user validation failed")) {
        // all other errors
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
        // console.log(errors);
        return errors;
    }
    //email dupicate error
    if (err.code === 11000) {
        errors["email"] = "This email is already registered";
        return errors;
    }
    return errors;
};

//

//jwt crating function , sending back
const maxage = 3 * 24 * 60 * 60; //in seconds
const createToken = (id) => {
    return jwt.sign({ id }, "a secret string ", {
        expiresIn: maxage,
    }); // sign jwt& passing in   {id} , secret, {options object}
};

//

module.exports.signup_get = (req, res) => {
    res.render("signup", { title: "Signup" });
};

module.exports.signup_post = async(req, res) => {
    const { userName, email, password, passwordConfirm } = req.body;
    console.log(req.body);

    try {
        if (password === passwordConfirm) {
            const user = await User.create({ userName, email, password }); // creating a new user with the User model
            const token = createToken(user._id); //create a jwt
            res.cookie("jwt", token, {
                httpOnly: true, //only acessed by server/backend
                maxAge: maxage * 1000, // in milliseconds
            });
            res.status(201).json({ user: user._id }); // send the user id as response to frontend
        } else {
            throw new Error("password confirm error");
        }
    } catch (err) {
        const errors = errorHandler(err); //function is called to get different errors
        // console.log(err.message);
        // console.log(errors);
        res.status(400).json({ errors }); //errors occurs send this back to frontend / user as json
    }
};

module.exports.login_get = (req, res) => {
    res.render("login", { title: "Login" });
};

module.exports.login_post = async(req, res) => {
    const { email, password } = req.body; //destructure eamil and password from login form
    // if success create cookie and send back a user property ie ._id
    // console.log(req.body);
    try {
        const user = await User.login(email, password); //(User model is importd) using the login method (static) of the user model
        // console.log(user);
        const token = createToken(user._id); // create tokens(jwt ) function is called
        // console.log(token);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxage * 1000 }); //create cookie
        res.status(200).json({ user: user._id }); //if sucessfully
    } catch (err) {
        const errors = errorHandler(err); //error handling function called (declared above)

        res.status(400).json({ errors }); //errors occur send this back to front
    }
};

//logging out a user

module.exports.logout_get = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 }); //we cant delete the cookie so //setting the cookie(existing cookie with name jwt) value as '' and expiry time very low
    res.redirect("/"); //redirect to home route
};