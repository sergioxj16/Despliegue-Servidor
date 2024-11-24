const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');

// GET /patients - Obtener todos los pacientes
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find();
        if (patients.length === 0) {
            return res.status(404).json({ error: 'No hay pacientes registrados', result: [] });
        }
        res.status(200).json({ error: '', result: patients });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', result: [] });
    }
});

// GET /patients/find?surname=Sanz - Buscar pacientes por apellido
router.get('/find', async (req, res) => {
    try {
        // Normalizamos el apellido a minúsculas
        const surname = req.query.surname;
        let patients;
        if(surname){
            patients = await Patient.find({
                surname: {
                    $regex: surname,
                    $options: "i",
                }
            });
        }
        else{
            patients = await Patient.find();
        }
        

        if (patients.length === 0) {
            return res.status(404).json({
                error: 'No se encontraron pacientes con los criterios especificados',
                result: [],
            });
        }

        res.status(200).json({ error: '', result: patients });
    } catch (error) {
        console.error('Error al buscar pacientes:', error.message); // Log para debug
        res.status(500).json({ error: 'Error interno del servidor', result: null });
    }
});
// GET /patients/:id - Obtener paciente por ID
router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Paciente no encontrado', result: null });
        }
        res.status(200).json({ error: '', result: patient });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', result: null });
    }
});


// POST /patients - Insertar paciente
router.post('/', async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        res.status(201).json({ error: '', result: newPatient });
    } catch (error) {
        res.status(400).json({ error: error.message, result: null });
    }
});

// PUT /patients/:id - Actualizar paciente
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const patientsInfo = req.body;

    try {
        const updatedPatient = await Patient.findByIdAndUpdate(id, ...patientsInfo);

        if (!updatedPatient) {
            return res.status(400).json({ error: 'Error actualizando los datos del paciente', result: null });
        }
        res.status(200).json({ error: '', result: updatedPatient });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', result: null });
    }
});

// DELETE /patients/:id - Eliminar paciente
router.delete('/:id', async (req, res) => {
    try {
        const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
        if (!deletedPatient) {
            return res.status(404).json({ error: 'Paciente a eliminar no encontrado', result: null });
        }
        res.status(200).json({ error: '', result: deletedPatient });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', result: null });
    }
});

module.exports = router;
