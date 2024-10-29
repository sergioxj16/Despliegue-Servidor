// Esquema y modelo para la colección de pacientes
// Para cada paciente recogeremos la siguiente información:
// • name: de tipo string, obligatorio. Debe tener una longitud mínima de 2 caracteres
// y una longitud máxima de 50.
// surname: de tipo string, obligatorio. Debe tener una longitud mínima de 2
// caracteres y una longitud máxima de 50.
// • bitrthDate: de tipo fecha, obligatorio.
// • address: de tipo string, opcional. Debe tener una longitud máxima de 100
// caracteres.
// • insuranceNumber: de tipo string, obligatorio. Debe cumplir con una expresión
// regular que valide exactamente 9 caracteres alfanuméricos. Además, el valor de
// esta propiedad debe ser único en la base de datos, garantizando que no se repita
// entre los pacientes registrados.