const mongo = require("mongoose");

const schema = mongo.Schema({
    Guild: Number,
    specialKey: String
});

module.exports = mongo.model("cluster0",schema);