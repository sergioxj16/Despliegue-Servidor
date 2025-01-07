const express = require('express');

let Mascota = require(__dirname + '/../models/mascota.js');
let router = express.Router();

// Servicio de listado
router.get('/', (req, res) => {
    Mascota.find().then(resultado => {
        res.status(200)
           .send({ok: true, resultado: resultado});
    }).catch (error => {
        res.status(500)
           .send({ok: false, error: "Error obteniendo mascotas"});
    });
});

// Servicio de inserción
router.post('/', (req, res) => {
    let nuevaMascota = new Mascota({
        nombre: req.body.nombre,
        tipo: req.body.tipo
    });

    nuevaMascota.save().then(resultado => {
        res.status(200)
           .send({ok: true, resultado: resultado});
    }).catch(error => {
        res.status(400)
           .send({ok: false, error: "Error añadiendo mascota"});
    });
});

// Servicio de borrado
router.delete('/:id', (req,res) => {
    Mascota.findByIdAndRemove(req.params['id'])
    .then(resultado => {
        if (resultado)
            res.status(200)
               .send({ok: true, resultado: resultado});
        else
            res.status(400)
               .send({ok: false, error: "Mascota no encontrada"});
    }).catch(error => {
        res.status(400)
           .send({ok: false, error: "Error borrando mascota"});
    });
});

module.exports = router;