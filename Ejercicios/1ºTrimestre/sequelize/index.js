const Sequelize = require('sequelize');
// Adaptar usuario y contraseña según convenga
const sequelize = new Sequelize('contactos_sequelize', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const ModeloContacto = require(__dirname + '/models/contacto');
const Contacto = ModeloContacto(sequelize, Sequelize);

// Con force:true se borra la BD y se crea de nuevo
// Sin este parámetro se conservan los registros y se 
// añaden los cambios nuevos

// sequelize.sync(/*{force: true}*/)
// .then(() => {
//     Contacto.create({
//         id: "10",
//         nombre: "Nacho",
//         telefono: "966112233"
//     }).then(resultado => {
//         if (resultado)
//             console.log("Contacto creado con estos datos:", resultado);
//         else
//             console.log("Error insertando contacto");
//     }).catch(error => {
//         console.log("Error insertando contacto:", error);
//     });
// }).catch (error => {
//     console.log(error);
// });

Contacto.findAll().then(resultado => {
    console.log("Listado de contactos: ", resultado);
}).catch(error => {
    console.log("Error listando contactos: ", error);
});

// Versión con async/await:
async function listarContactos() {
    try 
    {
        const resultado = await Contacto.findAll();
        console.log("Listado de contactos: ", resultado);
    } catch (error) {
        console.log("Error listando contactos: ", error);
    }
}

// Luego puedes llamar a tu función asíncrona
listarContactos();