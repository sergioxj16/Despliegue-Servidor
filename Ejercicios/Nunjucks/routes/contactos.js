const express = require('express');

let Contacto = require(__dirname + '/../models/contacto.js');
let router = express.Router();

// Servicio de listado general
router.get('/', (req, res) => {
    Contacto.find().then(resultado => {
        res.render('contactos_listado', { contactos: resultado });
    }).catch(error => {
        res.render('error', { error: 'Error listando contactos' });
    });
});

// Servicio de listado por id
router.get('/:id', (req, res) => {
    Contacto.findById(req.params['id']).then(resultado => {
        if (resultado)
            res.render('contactos_ficha', { contacto: resultado });
        else
            res.render('error', { error: 'Contacto no encontrado' });
    }).catch(error => {
        res.render('error', { error: 'Error buscando contacto' });
    });
});

// Servicio para insertar contactos
router.post('/', (req, res) => {

    let nuevoContacto = new Contacto({
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        edad: req.body.edad
    });
    nuevoContacto.save().then(resultado => {
        res.status(200)
            .send({ ok: true, resultado: resultado });
    }).catch(error => {
        res.status(400)
            .send({
                ok: false,
                error: "Error añadiendo contacto"
            });
    });
});

// Servicio para modificar contactos
router.put('/:id', (req, res) => {

    Contacto.findByIdAndUpdate(req.params.id, {
        $set: {
            nombre: req.body.nombre,
            telefono: req.body.telefono,
            edad: req.body.edad
        }
    }, { new: true }).then(resultado => {
        if (resultado)
            res.status(200)
                .send({ ok: true, resultado: resultado });
        else
            res.status(400)
                .send({ ok: false, error: "Contacto no encontrado" });
    }).catch(error => {
        res.status(400)
            .send({
                ok: false,
                error: "Error actualizando contacto"
            });
    });
});

// Servicio para borrar contactos
router.delete('/:id', (req, res) => {

    Contacto.findByIdAndRemove(req.params.id).then(resultado => {
        if (resultado)
            res.status(200)
                .send({ ok: true, resultado: resultado });
        else
            res.status(400)
                .send({ ok: false, error: "Contacto no encontrado" });
    }).catch(error => {
        res.status(400)
            .send({
                ok: false,
                error: "Error eliminando contacto"
            });
    });
});

module.exports = router;