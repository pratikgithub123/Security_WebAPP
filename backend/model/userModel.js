const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    phonenum: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart' 
    }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
