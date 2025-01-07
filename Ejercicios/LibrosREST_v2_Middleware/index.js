
// Carga de librerías
const express = require('express');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');

// Enrutadores
const libros = require(__dirname + '/routes/libros');
const autores = require(__dirname + '/routes/autores'); // Para la parte opcional

// Conectar con BD en Mongo 
mongoose.connect('mongodb://127.0.0.1:27017/libros');

// Inicializar Express
let app = express();

// Configuramos motor Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app
})

// Asignación del motor de plantillas
app.set('view engine', 'njk');

// Cargar middleware para peticiones POST y PUT
// y enrutadores



app.use(express.json());
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use('/libros', libros);
app.use('/autores', autores);



// Puesta en marcha del servidor
app.listen(8080);