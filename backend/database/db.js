const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Connected to Database");
    }).catch(err => {
        console.error("Database connection error:", err);
    });
}

module.exports = connectDB;
