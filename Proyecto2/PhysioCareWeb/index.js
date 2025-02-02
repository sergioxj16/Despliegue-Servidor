// index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const nunjucks = require('nunjucks');

dotenv.config({ path: ".env" });

const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'njk');

const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/physiocare";

mongoose
    .connect(DB_URL)
    .then(() => console.log("Conectado a MongoDB"))
    .catch((err) => console.error("Error conectando a MongoDB:", err));

// const patientRoutes = require("./routes/patientRoutes");
// const physioRoutes = require("./routes/physioRoutes");
// const recordRoutes = require("./routes/recordRoutes");

app.use(express.static('public'));
app.use(express.json());
// app.use("/patients", patientRoutes);
// app.use("/physios", physioRoutes);
// app.use("/records", recordRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
