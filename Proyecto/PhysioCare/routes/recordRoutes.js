const express = require("express");
const router = express.Router();
const Record = require("../models/record");
const Patient = require("../models/patient");
const { protectRoute } = require("../auth/auth.js");


// GET /records - Obtener todos los expedientes medicos
router.get("/", protectRoute(["admin", "physio"]), async (req, res) => {
    try {
        const records = await Record.find();
        if (records.length === 0) {
            return res.status(404).json({
                error: "No hay expedientes registrados",
                result: [],
            });
        }
        res.status(200).json({
            error: "",
            result: records,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor",
            result: [],
        });
    }
});

// GET /records/find - Buscar expedientes por apellido del paciente
router.get("/find", protectRoute(["admin", "physio"]), async (req, res) => {
    const { surname } = req.query;

    try {
        const patients = await Patient.find({
            surname: { $regex: surname, $options: "i" },
        });

        if (patients.length === 0) {
            return res.status(404).json({
                error: "No se encontraron pacientes",
                result: [],
            });
        }

        const patientsIds = patients.map((p) => p._id);

        const records = await Record.find({
            patient: { $in: patientsIds },
        });

        if (records.length === 0) {
            return res.status(404).json({
                error: "No se encontraron expedientes",
                result: [],
            });
        }

        res.status(200).json({
            error: "",
            result: records,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor",
            result: [],
        });
    }
});

// GET /records/:id - Obtener expediente por ID
router.get("/:id", protectRoute(["admin", "physio", "patient"]), async (req, res) => {
    const patientId = req.params.id;

    try {
        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                error: "Expediente no encontrado",
                result: null,
            });
        }
        const record = await Record.find({
            patient: patient._id,
        });

        if (!record) {
            return res.status(404).json({
                error: "Expediente no encontrado",
                result: null,
            });
        }

        if (req.user.rol === "patient" && req.user.id !== patientIdid) {
			return res.status(403).json({
				error: "Acceso no autorizado",
				resul: ""
			});
		}

        res.status(200).json({
            error: "",
            result: record,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor",
            result: null,
        });
    }
});

// POST /records - Crear un expediente medico
router.post("/", protectRoute(["admin", "physio"]), async (req, res) => {
    try {
        const newRecord = new Record(req.body);
        await newRecord.save();
        res.status(201).json({
            error: "",
            result: newRecord,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
            result: null,
        });
    }
});

// POST /records/:id/appointments - Añadir consultas a un expediente
router.post("/:id/appointments", protectRoute(["admin", "physio"]), async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                error: "Expediente no encontrado",
                result: null,
            });
        }
        record.appointments.push(req.body);

        await record.save();

        res.status(201).json({
            error: "",
            result: record,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error interno del servidor" + error.message,
            result: null,
        });
    }
});

// DELETE /records/:id - Eliminar expediente medico
router.delete("/:id", protectRoute(["admin", "physio"]), async (req, res) => {
    const recordId = req.params.id;
    try {
        const deletedRecord = await Record.findByIdAndDelete(recordId);

        if (!deletedRecord) {
            return res.status(404).json({
                error: "Expediente no encontrado",
                result: null,
            });
        }
        res.status(200).json({
            error: "",
            result: deletedRecord,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor",
            result: null,
        });
    }
});

module.exports = router;
