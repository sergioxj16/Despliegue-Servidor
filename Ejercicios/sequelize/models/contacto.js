// Parámetros: conexión a la BD y objeto para acceder
// a la API de Sequelize
module.exports = (sequelize, Sequelize) => {

    let Contacto = sequelize.define('contactos', {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        telefono: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    
    return Contacto;
};