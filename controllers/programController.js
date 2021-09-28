const Question = require("../models/Question");
const Topic = require("../models/Topic");

const errorHandler = (err) => {
    const errors = { questionHeading: "", link: "" };
    if (err.message.includes("Question validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
        return errors;
    }
};

module.exports.programming_post = async(req, res) => {
    // console.log(req.body);
    const { qnHead, qnLink, topicSelect } = req.body;
    const topicID = await Topic.findOne({ topic: topicSelect });
    if (topicID) {
        try {
            const newQn = await Question.create({
                questionHeading: qnHead,
                link: qnLink,
                topicId: topicID._id,
            });
            // console.log(newQn);
            res.json({ newQn: newQn._id });
        } catch (err) {
            const errors = errorHandler(err);
            // console.log(errors);
            // console.log(err.message);
            res.json({ errors });
        }
    } else {
        res.redirect("/404");
    }
};