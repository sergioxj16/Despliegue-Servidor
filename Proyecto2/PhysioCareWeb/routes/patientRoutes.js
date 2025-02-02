// patientRoutes.js
const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");
const { protectRoute } = require("../auth/auth.js");

router.get("/", protectRoute(["admin", "physio"]), async (req, res) => {
	try {
		const patients = await Patient.find();
		if (patients.length === 0) {
			return res.status(404).json({
				error: "No hay pacientes registrados",
				result: [],
			});
		}
		res.status(200).json({ error: "", result: patients });
	} catch (error) {
		res.status(500).json({ error: "Error interno del servidor", result: [] });
	}
});

router.get("/find", protectRoute(["admin", "physio"]), async (req, res) => {
	try {
		const surname = req.query.surname;
		let patients;
		if (surname) {
			patients = await Patient.find({
				surname: {
					$regex: surname,
					$options: "i",
				},
			});
		} else {
			patients = await Patient.find();
		}

		if (patients.length === 0) {
			return res.status(404).json({
				error: "No se encontraron pacientes con los criterios especificados",
				result: [],
			});
		}

		res.status(200).json({
			error: "",
			result: patients,
		});
	} catch (error) {
		res.status(500).json({
			error: "Error interno del servidor",
			result: null,
		});
	}
});
// GET /patients/:id - Obtener paciente por ID
router.get("/:id", protectRoute(["admin", "physio", "patient"]), async (req, res) => {
	try {
		const patient = await Patient.findById(req.params.id);
		if (!patient) {
			return res.status(404).json({
				error: "Paciente no encontrado",
				result: null,
			});
		}
		if (req.user.rol === "patient" && req.user.id !== req.params.id) {
			return res.status(403).json({
				error: "Acceso no autorizado",
				result: null,
			});
		}

		res.status(200).json({
			error: "",
			result: patient,
		});
	} catch (error) {
		res.status(500).json({
			error: "Error interno del servidor",
			result: null,
		});
	}
});

// POST /patients - Insertar paciente
router.post("/", protectRoute(["admin", "physio"]), async (req, res) => {
	try {
		const newPatient = new Patient(req.body);
		await newPatient.save();
		res.status(201).json({
			error: "",
			result: newPatient,
		});
	} catch (error) {
		res.status(400).json({
			error: error.message,
			result: null,
		});
	}
});

// PUT /patients/:id - Actualizar paciente
router.put("/:id", protectRoute(["admin", "physio"]), async (req, res) => {
	const id = req.params.id;
	const patientsInfo = req.body;

	try {
		const updatedPatient = await Patient.findByIdAndUpdate(id, {
			...patientsInfo,
			new: true,
			runValidators: true,
		});		

		if (!updatedPatient) {
			return res.status(400).json({
				error: "Error actualizando los datos del fisio",
				result: null,
			});
		}
		res.status(200).json({
			error: null,
			result: updatedPatient,
		});
	} catch (error) {
		res.status(500).json({
			error: "Error interno del servidor",
			result: null,
		});
	}
});

// DELETE /patients/:id - Eliminar paciente
router.delete("/:id", protectRoute(["admin"]), async (req, res) => {
	const id = req.params.id;
	try {
		const deletedPatient = await Patient.findByIdAndDelete(id);

		if (!deletedPatient) {
			return res.status(404).json({
				error: "Paciente a eliminar no encontrado",
				result: null,
			});
		}

		res.status(200).json({
			error: "",
			result: deletedPatient,
		});
	} catch (error) {
		res.status(500).json({
			error: "Error interno del servidor",
			result: null,
		});
	}
});

module.exports = router;
