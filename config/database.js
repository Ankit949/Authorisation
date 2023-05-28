const mongoose = require("mongoose")

const { MONGODB_URL } = process.env

exports.connect = () => {
    mongoose.connect(MONGODB_URL , {
        useNewUrlParser : true,
        useUnifiedTopology: true,
    })
    .then(console.log("Connection successful"))
    .catch((error) => {
        console.log("Connection Unsuccesful")
        console.log(error)
        process.exit(1)
    })
}