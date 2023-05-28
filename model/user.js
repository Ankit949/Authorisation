const mongoose = require("mongoose")

const { Schema } = mongoose

const userSchema = new Schema({
    firstName : {
        type: String,
        default: null,
    },
    lastName : {
        type: String,
        default: null
    },
    email : {
        type: String,
        unique: true
    },
    passWord : {
        type: String,
        unique: true
    },
    token: {
        type: String
    }
});

module.exports = mongoose.model("user", userSchema)