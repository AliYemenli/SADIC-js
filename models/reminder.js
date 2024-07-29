const {model, Schema} = require("mongoose");

let schema = new Schema({
    user: String,
    userName: String,
    reminders: [{
        time: String,
        text: String,
        isPersonal: Boolean
    }]
});

module.exports = model("reminders",schema);

