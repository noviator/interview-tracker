const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: [true, "Please enter a Topic"],
        unique: [true, "The topic already exists"],
    },
});

topicSchema.pre("save", function(next) {
    // capitalize
    this.topic =
        this.topic.charAt(0).toUpperCase() + this.topic.slice(1).toLowerCase();
    next();
});

const Topics = mongoose.model("topic", topicSchema);
module.exports = Topics;