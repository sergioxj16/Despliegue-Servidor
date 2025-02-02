// physioRoutes.js
const express = require("express");
const router = express.Router();
const Physio = require("../models/physio");
const { protectRoute } = require("../auth/auth.js");


// GET /physios - Obtener todos los fisioterapeutas
router.get("/", protectRoute(["admin", "physio", "patient"]), async (req, res) => {
	try {
		const physios = await Physio.find();

		if (physios.length === 0) {
			return res.status(404).json({
				error: "No hay fisios registrados",
				result: [],
			});
		}
		res.status(200).json({
			error: "",
			result: physios,
		});
	} catch (error) {
		res.status(500).json({
			error: "Error interno del servidor",
			result: [],
		});
	}
});

// GET /physios/find - Buscar fisios por especialidad
router.get("/find", protectRoute(["admin", "physio", "patient"]), async (req, res) => {
	try {
		const { specialty } = req.query;
		const physios = await Physio.find({
			specialty: { $regex: specialty, $options: "i" },
		});
		if (physios.length === 0) {
			return res.status(404).json({
				error: "No se encontraron fisios con esa especialidad",
				result: [],
			});
		}
		res.status(200).json({
			error: "",
			result: physios,
		});
	} catch (error) {
		res.status(500).json({
			error: "Error interno del servidor",
			result: [],
		});
	}
});

// GET /physios/:id - Obtener fisio por ID
router.get("/:id", protectRoute(["admin", "physio", "patient"]), async (req, res) => {
	try {
		const physio = await Physio.findById(req.params.id);

		if (!physio) {
			return res.status(404).json({
				error: "Fisio no encontrado",
				result: null,
			});
		}
		res.status(200).json({
			error: "",
			result: physio,
		});
	} catch (error) {
		res.status(500).json({
			error: "Error interno del servidor",
			result: null,
		});
	}
});

// POST /physios - Insertar un fisio
router.post("/", protectRoute(["admin"]), async (req, res) => {
	try {
		const newPhysio = new Physio(req.body);
		await newPhysio.save();
		res.status(201).json({
			error: "",
			result: newPhysio,
		});
	} catch (error) {
		res.status(400).json({
			error: error.message,
			result: null,
		});
	}
});

// PUT /physios/:id - Actualizar fisio
router.put("/:id", protectRoute(["admin"]), async (req, res) => {
	try {
		const id = req.params.id;
		const updateData = req.body;

		const updatedPhysio = await Physio.findByIdAndUpdate(
			id,
			updateData,
			{ new: true, runValidators: true }
		);

		if (!updatedPhysio) {
			return res.status(400).json({
				error: "Error actualizando los datos del fisio",
				result: null,
			});
		}
		res.status(200).json({
			error: "",
			result: updatedPhysio,
		});
	} catch (error) {
		res.status(500).json({
			error: "Error interno del servidor",
			result: null,
		});
	}
});

// DELETE /physios/:id - Eliminar fisio
router.delete("/:id", protectRoute(["admin"]), async (req, res) => {
	try {
		const deletedPhysio = await Physio.findByIdAndDelete(req.params.id);
		if (!deletedPhysio) {
			return res.status(404).json({
				error: "Fisio a eliminar no encontrado",
				result: null,
			});
		}
		res.status(200).json({
			error: "",
			result: deletedPhysio,
		});
	} catch (error) {
		res.status(500).json({
			error: "Error interno del servidor",
			result: null,
		});
	}
});

module.exports = router;
