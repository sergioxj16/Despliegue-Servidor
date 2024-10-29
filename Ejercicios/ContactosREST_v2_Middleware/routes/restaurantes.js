const express = require('express');

let Restaurante = require(__dirname + '/../models/restaurante.js');
let router = express.Router();

// Servicio de listado
router.get('/', (req, res) => {
    Restaurante.find().then(resultado => {
        res.status(200)
           .send({ok: true, resultado: resultado});
    }).catch (error => {
        res.status(500)
           .send({ok: false, error: "Error obteniendo restaurantes"});
    });
});

// Servicio de inserción
router.post('/', (req, res) => {
    let nuevoRestaurante = new Restaurante({
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        telefono: req.body.telefono
    });

    nuevoRestaurante.save().then(resultado => {
        res.status(200)
           .send({ok: true, resultado: resultado});
    }).catch(error => {
        res.status(400)
           .send({ok: false, error: "Error añadiendo restaurante"});
    });
});

// Servicio de borrado
router.delete('/:id', (req,res) => {
    Restaurante.findByIdAndRemove(req.params['id'])
    .then(resultado => {
        if (resultado)
            res.status(200)
               .send({ok: true, resultado: resultado});
        else
            res.status(400)
               .send({ok: false, error: "Restaurante no encontrado"});
    }).catch(error => {
        res.status(400)
           .send({ok: false, error: "Error borrando restaurante"});
    });
});

module.exports = router;