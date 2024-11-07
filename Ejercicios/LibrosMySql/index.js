const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "libros"
});

conexion.connect((error) => {
    if (error)
        console.log("Error al conectar con la BD:", error);
    else
        console.log("Conexión satisfactoria");
});

// Insertar tres libros
conexion.query("INSERT INTO libros (titulo, autor, precio) VALUES ('Cien años de soledad', 'Gabriel García Márquez', 12.5)", (error, resultado) => {
    if (error) console.log("Error al insertar libro 1:", error);
});

conexion.query("INSERT INTO libros (titulo, autor, precio) VALUES ('Don Quijote de la Mancha', 'Miguel de Cervantes', 15.0)", (error, resultado) => {
    if (error) console.log("Error al insertar libro 2:", error);
});

conexion.query("INSERT INTO libros (titulo, autor, precio) VALUES ('Rayuela', 'Julio Cortázar', 20.0)", (error, resultado) => {
    if (error) console.log("Error al insertar libro 3:", error);
});

// Listar libros con precio mayor a 10 euros
conexion.query("SELECT * FROM libros WHERE precio > 10", (error, resultados) => {
    if (error) {
        console.log("Error al listar libros:", error);
    } else {
        console.log("Libros con precio mayor a 10 euros:");
        resultados.forEach((libro) => {
            console.log(libro.titulo, "-", libro.precio + "€");
        });
    }
});

// Modificar el precio del libro con id = 1 a 35 euros
conexion.query("UPDATE libros SET precio = 35 WHERE id = 1", (error, resultado) => {
    if (error) console.log("Error al modificar el precio del libro:", error);
});

// Borrar el libro con id = 3
conexion.query("DELETE FROM libros WHERE id = 3", (error, resultado) => {
    if (error) console.log("Error al borrar el libro:", error);
});

// Cerrar la conexión
conexion.end();
