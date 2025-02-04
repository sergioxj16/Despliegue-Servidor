const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const methodOverride = require("method-override");
dotenv.config();

const Patient = require("./routes/patientRoutes");
const Physio = require("./routes/physioRoutes");
const Record = require("./routes/recordRoutes");
const Auth = require("./routes/authRoutes");

const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/physiocare";

mongoose
  .connect(DB_URL)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));


const app = express();

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: false,
    expires: new Date(Date.now() + (5 * 60 * 1000)) // 5 minutos
  })
);


const env = nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

env.addFilter("formatDate", (date) => {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
});

app.set("view engine", "njk");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use("/public", express.static(__dirname + "/public"));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use("/patients", Patient);
app.use("/physios", Physio);
app.use("/records", Record);
app.use("/auth", Auth);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
