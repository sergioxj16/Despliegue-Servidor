const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Conectar a MongoDB
mongoose
    .connect("mongodb://127.0.0.1:27017/physiocare")
    .then(() => console.log("Conectado a MongoDB"))
    .catch((err) => console.error("Error conectando a MongoDB:", err));

// Importar y cargar rutas
const patientRoutes = require("./routes/patientRoutes");
const physioRoutes = require("./routes/physioRoutes");
const recordRoutes = require("./routes/recordRoutes");

// Configurar middleware
app.use(express.json());
app.use("/patients", patientRoutes);
app.use("/physios", physioRoutes);
app.use("/records", recordRoutes);

// Iniciar servidor
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
