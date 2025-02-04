const express = require("express");
const patientController = require("../controllers/patientController.js");
const { allowedRoles } = require("../utils/auth.js");
const upload = require("../utils/uploads.js");

const router = express.Router();

router.post("/", allowedRoles("admin", "physio"), upload.upload.single("image"), patientController.addPatient);
router.post("/:id", allowedRoles("admin", "physio"), upload.upload.single("image"), patientController.editPatient);

router.get("/", allowedRoles("admin", "physio"), patientController.showPatients);
router.get("/new", allowedRoles("admin", "physio"), patientController.showAddPatient);
router.get("/find", allowedRoles("admin", "physio"), patientController.findPatientBySurname);
router.get("/edit/:id", allowedRoles("admin", "physio"), patientController.showUpdatePatient);
router.get("/:id", allowedRoles("admin", "physio", "patient"), patientController.getPatientDetails);

router.delete("/:id", allowedRoles("admin", "physio"), patientController.deletePatient);

module.exports = router;
