const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const requireAdminAuth = require("./middleware/adminAuthMiddleware");
const adminRouter = require("./routes/adminRouter");
const Topic = require("./models/Topic");
const Question = require("./models/Question");
const { ready } = require("jquery");
const programmingRoute = require("./routes/programmingRoute");
const { nextTick } = require("process");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// Bootstrap //
app.use(
    "/css",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
    "/js",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
    "/js",
    express.static(path.join(__dirname, "node_modules/jquery/dist"))
);
//bootstrap end//

app.set("view engine", "ejs");

const dbURI =
    "";
mongoose
    .connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));
// app.listen(3000);

//

//
app.get("*", checkUser); // '*' -> means to apply to every route (ie . every get request fires the checkUser function);

app.get("/", (req, res) => {
    res.render("home", { title: "Home" });
});

// app.get("/admin", requireAdminAuth, (req, res) => {
//     console.log(res);
// });
//

// route restricted using requireAuth middleware
app.get("/newRoute", requireAuth, (req, res) => {
    res.render("newRoute", { title: "Protected" });
});

// app.post("/programming");
app.get("/programming", requireAuth, (req, res) => {
    Topic.find()
        .then((result) => {
            res.render("programming", {
                title: "Programming Topics",
                topics: result,
            });
        })
        .catch((err) => {
            console.log("ErRoR", err);
        });
});

//wild card routing
/*app.get("/programming/*", requireAuth, (req, res) => {
    // console.log(req.params[0]);
    const wildTopicName =
        req.params[0].charAt(0).toUpperCase() + req.params[0].slice(1); // req .params[0] is in lowercase but in topic schema first letter is upper case
    Topic.findOne({ topic: wildTopicName })
        .then((result) => {
            // console.log(result);
            if (result) {
                Question.find({ topicId: result._id })
                    .then((qn) => {
                        res.render("topic", { title: wildTopicName, datas: qn });
                    })
                    .catch((errr) => {
                        console.log("erroRR", errr);
                    });
            } else {
                res.redirect("/404");
            }
        })
        .catch((err) => {
            console.log("ErroR", err);
        });
});*/

//wild card routing

app.get("/programming/:topicName", requireAuth, async(req, res) => {
    // console.log(req.params[0]);
    const wildTopicName =
        req.params.topicName.charAt(0).toUpperCase() +
        req.params.topicName.slice(1); // req .params[0] is in lowercase but in topic schema first letter is upper case

    try {
        const result = await Topic.findOne({ topic: wildTopicName });
        if (result) {
            try {
                const qn = await Question.find({ topicId: result._id });
                res.render("topic", { title: wildTopicName, datas: qn });
            } catch (errr) {
                console.log("erroRR", errr);
            }
        } else {
            res.redirect("/404");
        }
    } catch (err) {
        console.log("ErroR", err);
    }
});

// app.get()
// app.get("/signup_page", (req, res) => {
//     res.render("signup");
// });

//

app.use(programmingRoute);
app.use(authRoutes);
app.use("/admin", adminRouter);

//error page always last

app.get("*", (req, res) => {
    res.status(404);
    res.render("404", { title: "Error 404" });
});