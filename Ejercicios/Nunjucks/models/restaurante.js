const mongoose = require('mongoose');

// Restaurantes
let restauranteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^\d{9}$/
    }
});

// Modelo
let Restaurante = mongoose.model('restaurante', restauranteSchema);

module.exports = Restaurante;