const mysql = require('mysql2');

// Cambiar usuario y contraseña por los que tengamos en
// nuestro sistema
let conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "contactos"
});

conexion.connect((error) => {
    if (error)
        console.log("Error al conectar con la BD:", err);
    else
        console.log("Conexión satisfactoria");
});

// El método query ya establece la conexión, 
// no es necesario conectar previamente
conexion.query("SELECT * FROM contactos", 
    (error, resultado, campos) => {
        if (error)
            console.log("Error al procesar la consulta");
        else 
        {
            resultado.forEach((contacto) => {
                console.log(contacto.nombre, ":",
                    contacto.telefono);
            });
        }
    });

// conexion.query("INSERT INTO contactos" + 
//     "(nombre, telefono) VALUES " +
//     "('Fernando', '966566556')", (error, resultado, campos) => {
//         if (error)
//             console.log("Error al procesar la inserción");
//         else
//             console.log("Nuevo id = ", resultado.insertId);
//     });