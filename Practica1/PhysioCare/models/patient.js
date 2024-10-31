let mongoose = require('mongoose');

let patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        maxlength: 100,
        trim: true
    },
    insuranceNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9]{9}$/
    }
});

let Patient = mongoose.model('patients', patientSchema);
module.exports = Patient;
