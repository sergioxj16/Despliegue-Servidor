const express = require('express');
const router = express.Router();
const Record = require('../models/record');

// GET /records - Obtener todos los expedientes médicos
router.get('/', async (req, res) => {
    try {
        const records = await Record.find();
        if (records.length === 0) {
            return res.status(404).json({ error: 'No hay expedientes registrados', result: [] });
        }
        res.status(200).json({ error: '', result: records });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', result: [] });
    }
});

// GET /records/:id - Obtener expediente por ID
router.get('/:id', async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Expediente no encontrado', result: null });
        }
        res.status(200).json({ error: '', result: record });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', result: null });
    }
});

// GET /records/find - Buscar expedientes por apellido del paciente
router.get('/find', async (req, res) => {
    try {
        const { surname } = req.query;
        const records = await Record.find({ patientSurname: { $regex: surname, $options: 'i' } });
        if (records.length === 0) {
            return res.status(404).json({ error: 'No se encontraron expedientes', result: [] });
        }
        res.status(200).json({ error: '', result: records });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', result: [] });
    }
});

// POST /records - Crear un expediente médico
router.post('/', async (req, res) => {
    try {
        const newRecord = new Record(req.body);
        await newRecord.save();
        res.status(201).json({ error: '', result: newRecord });
    } catch (error) {
        res.status(400).json({ error: error.message, result: null });
    }
});

// POST /records/:id/appointments - Añadir consultas a un expediente
router.post('/:id/appointments', async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Expediente no encontrado', result: null });
        }
        record.appointments.push(req.body);
        await record.save();
        res.status(201).json({ error: '', result: record });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', result: null });
    }
});

// DELETE /records/:id - Eliminar expediente médico
router.delete('/:id', async (req, res) => {
    try {
        const deletedRecord = await Record.findByIdAndDelete(req.params.id);
        if (!deletedRecord) {
            return res.status(404).json({ error: 'Expediente no encontrado', result: null });
        }
        res.status(200).json({ error: '', result: deletedRecord });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', result: null });
    }
});

module.exports = router;
