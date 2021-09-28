const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
// const { use } = require("../routes/authRoutes");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Please enter a name"],
    },
    email: {
        type: String,
        required: [true, "Enter Email"],
        validate: [isEmail, "Please enter a valid e-mail id"],
        lowerCase: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [8, "Minimum length of password must be 8 characters"],
    },
});

// hashing before saving password
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// after document gets saved
userSchema.post("save", function(doc, next) {
    console.log("new user saved ", doc);

    next();
});

// static method (which is used to login user)
// mathod name -login
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email }); //this refers to user model ,not the instance
    //if the user exists compare pass, otherwise err- incorrect email
    if (user) {
        const auth = await bcrypt.compare(password, user.password); // bcrypt compares the hashed passwords with text passwords
        if (auth) {
            return user;
        }
        throw Error("incorrect password"); //if the password is incorrect
    }
    throw Error("incorrect email");
};

const User = mongoose.model("user", userSchema);
module.exports = User;