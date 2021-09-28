const mongoose = require("mongoose");
const Topics = require("./Topic");

const questionSchema = new mongoose.Schema({
    questionHeading: {
        type: String,
        required: [true, "please enter question heading"],
    },
    link: { type: String, required: [true, "please enter link"] },
    topicId: { type: mongoose.Types.ObjectId, ref: "topic" },
    approved: { type: Boolean, default: false },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;