const mongoose = require('mongoose');

let patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The name is required.'],
        minlength: [2, 'The name must have at least 2 characters.'],
        maxlength: [50, 'The name cannot be longer than 50 characters.']
    },
    surname: {
        type: String,
        required: [true, 'The surname is required.'],
        minlength: [2, 'The surname must have at least 2 characters.'],
        maxlength: [50, 'The surname cannot be longer than 50 characters.']
    },
    birthDate: {
        type: Date,
        required: [true, 'The birth date is required.']
    },
    address: {  
        type: String,
        required: false,
        maxlength: [100, 'The address cannot exceed 100 characters.']
    },
    insuranceNumber: {
        type: String,
        required: [true, 'The insurance number is required.'],
        match: [/^[a-zA-Z0-9]{9}$/, 'The insurance number must be exactly 9 alphanumeric characters.'],
        unique: [true, 'The insurance number must be unique.']
    },
    image: {
        type: String,
        required: false
    }
});

let Patient = mongoose.model('patients', patientSchema);
module.exports = Patient;
