// physio.js
let mongoose = require('mongoose');

let physioSchema = new mongoose.Schema({
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
    specialty: {
        type: String,
        required: true,
        enum: ['Sports', 'Neurological', 'Pediatric', 'Geriatric', 'Oncological']
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9]{8}$/
    }
});

let Physio = mongoose.model('physios', physioSchema);
module.exports = Physio;
