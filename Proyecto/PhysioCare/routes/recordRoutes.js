const express = require("express");
const router = express.Router();
const Record = require("../models/record");
const Patient = require("../models/patient");

// GET /records - Obtener todos los expedientes médicos
router.get("/", async (req, res) => {
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
router.get("/find", async (req, res) => {
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
router.get("/:id", async (req, res) => {
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
                result: "",
            });
        }
        res.status(200).json({
            error: "",
            result: record,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor",
            result: "",
        });
    }
});

// POST /records - Crear un expediente médico
router.post("/", async (req, res) => {
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
            result: "",
        });
    }
});

// POST /records/:id/appointments - Añadir consultas a un expediente
router.post("/:id/appointments", async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                error: "Expediente no encontrado",
                result: "",
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
            result: "",
        });
    }
});

// DELETE /records/:id - Eliminar expediente médico
router.delete("/:id", async (req, res) => {
    const recordId = req.params.id;
    try {
        const deletedRecord = await Record.findByIdAndDelete(recordId);

        if (!deletedRecord) {
            return res.status(404).json({
                error: "Expediente no encontrado",
                result: "",
            });
        }
        res.status(200).json({
            error: "",
            result: deletedRecord,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor",
            result: "",
        });
    }
});

module.exports = router;
