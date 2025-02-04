const express = require("express");
const recordController = require("../controllers/recordController.js");
const { allowedRoles } = require("../utils/auth.js");
const Patient = require("../models/patient.js");

const router = express.Router();

router.get("/", allowedRoles("admin", "physio"), recordController.showRecords);
router.get("/new", allowedRoles("admin", "physio"), recordController.showAddRecord);
router.get("/:id/appointments/new", allowedRoles("admin", "physio"), recordController.showAddAppointment);
router.get("/find", allowedRoles("admin", "physio"), recordController.findRecordsBySurname);
router.get("/:id", allowedRoles("admin", "physio", "patient"), recordController.showRecordDetail);

router.post("", allowedRoles("admin", "physio"), recordController.addRecord);
router.post("/:id/appointments/", allowedRoles("admin", "physio"), recordController.createAppointment);
router.delete("/:id", allowedRoles("admin"), recordController.deleteRecordById);

module.exports = router;