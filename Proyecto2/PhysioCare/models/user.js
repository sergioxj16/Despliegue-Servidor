const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minlength: 4,
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
    },
    rol: {
        type: String,
        required: true,
        enum: ['admin', 'physio', 'patient'],
    },
});
const User = mongoose.model("Users", userSchema);
module.exports = User;