const express = require('express');

let Libro = require(__dirname + '/../models/libro.js');
let router = express.Router();

// Ejercicio: Middleware para mostrar información de la petición recibida
router.use((req, res, next) => {
    console.log(new Date().toString(), "Método:", req.method,
        ", URL:", req.baseUrl);
    next();
});

router.get('/nuevo', (req, res) => {
    res.render('libros_nuevo');
});

router.get('/', (req, res) => {
    Libro.find().then(resultado => {
        res.render('libros_listado', { libros: resultado });
    }).catch(error => {
        res.render('error', { error: 'Error listando libros' });
    });
});

// Servicio de listado por id
router.get('/:id', (req, res) => {
    Libro.findById(req.params['id']).then(resultado => {
        if (resultado)
            res.render('libros_ficha', { libros: resultado });
        else
            res.render('error', { error: 'libros no encontrado' });
    }).catch(error => {
        res.render('error', { error: 'Error buscando libros' });
    });
});

router.get('/editar/:id', (req, res) => {
    Libro.findById(req.params['id']).then(resultado => {
        if (resultado) {
            res.render('libros_editar', { libro: resultado });
        } else {
            res.render('error', { error: "libro no encontrado" });
        }
    }).catch(error => {
        res.render('error', { error: "Libro no encontrado" });
    });
});

router.put('/:id', (req, res) => {
    Libro.findByIdAndUpdate(req.params.id, {
        $set: {
            titulo: req.body.titulo,
            editorial: req.body.editorial,
            precio: req.body.precio,
            autor: req.body.autor
        }
    }, { new: true }).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('error', { error: "Error modificando libro" });
    });
});

// Servicio para borrar libros
router.delete('/:id', (req, res) => {
    Libro.findByIdAndRemove(req.params.id).then(resultado => {
        if (resultado) {
            res.redirect(req.baseUrl);
        } else {
            res.render('error', { error: "Libro no encontrado" });
        }
    }).catch(error => {
        res.render('error', { error: "Error borrando libro" });
    });
});


// Servicio para insertar libros
router.post('/', (req, res) => {

    let nuevoLibro = new Libro({
        titulo: req.body.titulo,
        editorial: req.body.editorial,
        precio: req.body.precio,
        autor: req.body.autor
    });
    nuevoLibro.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('error',
            { error: "Error añadiendo libro" });
    });
});

// Servicio para modificar libros
router.put('/:id', (req, res) => {

    Libro.findByIdAndUpdate(req.params.id, {
        $set: {
            titulo: req.body.titulo,
            editorial: req.body.editorial,
            precio: req.body.precio,
            autor: req.body.autor
        }
    }, { new: true }).then(resultado => {
        if (resultado)
            res.status(200)
                .send({ ok: true, resultado: resultado });
        else
            res.status(400)
                .send({
                    ok: false,
                    error: "No se ha encontrado el libro para actualizar"
                });
    }).catch(error => {
        res.status(400)
            .send({
                ok: false,
                error: "Error actualizando libro"
            });
    });
});



module.exports = router;