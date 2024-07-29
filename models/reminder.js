const {model, Schema} = require("mongoose");

let schema = new Schema({
    user: String,
    isPersonal: Boolean,
    reminders: [{
        time: String,
        text: String
    }]
});

module.exports = model("reminders",schema);

