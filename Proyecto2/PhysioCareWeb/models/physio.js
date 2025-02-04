const mongoose = require('mongoose');

let physioSchema = new mongoose.Schema({
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
    specialty: {
        type: String,
        required: [true, 'The specialty is required.'],
        enum: {
            values: ['Sports', 'Neurological', 'Pediatric', 'Geriatric', 'Oncological'],
            message: 'The specialty must be one of: Sports, Neurological, Pediatric, Geriatric, Oncological.'
        }
    },
    licenseNumber: {
        type: String,
        required: [true, 'The license number is required.'],
        match: [/^[a-zA-Z0-9]{8}$/, "The license number must be exactly 8 alphanumeric characters"],
        unique: [true, 'The license number must be unique.']
    },
    image: {
        type: String,
        required: false
    }
});

let Physio = mongoose.model('physios', physioSchema);
module.exports = Physio;
