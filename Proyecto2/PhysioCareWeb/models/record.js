const mongoose = require('mongoose');

let appointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'The appointment date is required.']
    },
    physio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'physios',
        required: [true, 'The physiotherapist is required.']
    },
    diagnosis: {
        type: String,
        required: [true, 'The diagnosis is required.'],
        minlength: [10, 'The diagnosis must have at least 10 characters.'],
        maxlength: [500, 'The diagnosis cannot exceed 500 characters.']
    },
    treatment: {
        type: String,
        required: [true, 'The treatment is required.']
    },
    observations: {
        type: String,
        maxlength: [500, 'The observations cannot exceed 500 characters.']
    }
});

let recordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patients',
        required: [true, 'The patient is required.']
    },
    medicalRecord: {
        type: String,
        maxlength: [1000, 'The medical record cannot exceed 1000 characters.']
    },
    appointments: [appointmentSchema]
});

let Record = mongoose.model('records', recordSchema);

module.exports = Record;
