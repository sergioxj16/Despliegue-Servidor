const mongoose = require('mongoose');

let comentarioSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true,
        default: new Date()
    },
    nick: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    texto: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

let libroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        minlength: 3,
        trim: true          // Esto no se pedía en el enunciado
    },
    editorial: {
        type: String
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    // Vinculación de libro con autor
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'autores'
    },
    // Vinculación de libro con comentarios (subdocumento)
    comentarios: [comentarioSchema]
});

let Libro = mongoose.model('libros', libroSchema);
module.exports = Libro;
