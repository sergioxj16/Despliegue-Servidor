const express = require('express');

const upload = require(__dirname + '/../utils/uploads.js');
let Libro = require(__dirname + '/../models/libro.js');
let router = express.Router();

// Listado general
router.get('/', (req, res) => {
    Libro.find().then(resultado => {
        res.render('libros_listado', { libros: resultado});
    }).catch (error => {
    }); 
});

// Formulario de nuevo libro
router.get('/nuevo', (req, res) => {
    res.render('libros_nuevo');
});

// Formulario de edición de libro
router.get('/editar/:id', (req, res) => {
    Libro.findById(req.params['id']).then(resultado => {
        if (resultado) {
            res.render('libros_editar', {libro: resultado});
        } else {
            res.render('error', {error: "Libro no encontrado"});
        }
    }).catch(error => {
        res.render('error', {error: "Libro no encontrado"});
    });
});

// Ficha de libro
router.get('/:id', (req, res) => {
    Libro.findById(req.params.id).then(resultado => {
        if (resultado)
            res.render('libros_ficha', { libro: resultado});
        else    
            res.render('error', {error: "Libro no encontrado"});
    }).catch (error => {
    }); 
});

// Insertar libros
router.post('/', upload.upload.single('portada'), (req, res) => {
    let nuevoLibro = new Libro({
        titulo: req.body.titulo,
        editorial: req.body.editorial,
        precio: req.body.precio
    });
    if (req.file)
        nuevoLibro.portada = req.file.filename;

    nuevoLibro.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('error', {error: "Error insertando libro"});
    });
});

// Borrar libros
router.delete('/:id', (req, res) => {
    Libro.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('error', {error: "Error borrando libro"});
    });
});

// Modificar libros
// Lo definimos como "POST" para integrarlo mejor en un formulario multipart
router.post('/:id', upload.upload.single('portada'), (req, res) => {
    // Buscamos el libro y cambiamos sus datos
    Libro.findById(req.params.id).then(resultado => {
        if (resultado)
        {
            resultado.titulo = req.body.titulo;
            resultado.editorial = req.body.editorial;
            resultado.precio = req.body.precio;
            // Si viene una portada, la cambiamos
            if(req.file)
                resultado.portada = req.file.filename;
            resultado.save().then(resultado2 => {
                res.redirect(req.baseUrl);
            }).catch(error2 => {
                res.render('error', {error: "Error editando libro"});
            });        
        }
        else    
            res.render('error', {error: "Libro no encontrado"});
    }).catch (error => {
        res.render('error', {error: "Error editando libro"});
    }); 
});

module.exports = router;