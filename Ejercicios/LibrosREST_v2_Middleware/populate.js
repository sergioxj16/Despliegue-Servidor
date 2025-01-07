const mongoose = require('mongoose');
const Libro = require('./models/libro'); // Asegúrate de que el path es correcto

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/libros', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexión exitosa a la base de datos');
}).catch(err => {
    console.error('Error conectando a la base de datos:', err);
});

// Datos de ejemplo
const librosEjemplo = [
    {
        titulo: 'Cien Años de Soledad',
        editorial: 'Sudamericana',
        precio: 15.99,
        autor: new mongoose.Types.ObjectId(), // Usa un ID válido en tu base de datos
        comentarios: [
            {
                fecha: new Date(),
                nick: 'lector1',
                texto: 'Un clásico imperdible.'
            },
            {
                fecha: new Date(),
                nick: 'lector2',
                texto: 'Una obra maestra.'
            }
        ]
    },
    {
        titulo: 'Don Quijote de la Mancha',
        editorial: 'Francisco de Robles',
        precio: 20.49,
        autor: new mongoose.Types.ObjectId(),
        comentarios: [
            {
                fecha: new Date(),
                nick: 'lector3',
                texto: 'Divertido y profundo a la vez.'
            }
        ]
    },
    {
        titulo: 'El Principito',
        editorial: 'Reynal & Hitchcock',
        precio: 10.99,
        autor: new mongoose.Types.ObjectId(),
        comentarios: [
            {
                fecha: new Date(),
                nick: 'lector4',
                texto: 'Un libro para todas las edades.'
            },
            {
                fecha: new Date(),
                nick: 'lector5',
                texto: 'Hermoso mensaje sobre la vida.'
            }
        ]
    }
];

// Insertar datos
const poblarBaseDeDatos = async () => {
    try {
        await Libro.deleteMany(); // Elimina todos los documentos existentes
        const resultado = await Libro.insertMany(librosEjemplo);
        console.log('Libros insertados exitosamente:', resultado);
    } catch (error) {
        console.error('Error al insertar los libros:', error);
    } finally {
        mongoose.connection.close(); // Cierra la conexión con la base de datos
    }
};

// Ejecutar el script
poblarBaseDeDatos();
