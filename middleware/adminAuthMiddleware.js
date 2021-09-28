const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAdminAuth = (req, res, next) => {
    const token = req.cookies.jwt; // here jwt == cookie name
    if (token) {
        jwt.verify(token, "a secret string ", async(err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect("/login");
            } else {
                let user = await User.findById(decodedToken.id);
                console.log(user);
                // res.redirect("/admin");
                // console.log(decodedToken.id);
                next();
            }
        });
    } else {
        res.redirect("/login");
    }
};

module.exports = requireAdminAuth;