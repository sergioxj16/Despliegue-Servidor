const Record = require("../models/record");
const Patient = require("../models/patient");
const Physio = require("../models/physio");

const showRecords = async (req, res) => {
    try {
        if (req.user.role === "patient") {
            const record = await Record.findOne({ patient: req.user._id }).populate("patient");
            if (record) {
                return res.redirect(`/records/${record._id}`);
            }
        }

        const result = await Record.find().populate("patient");
        const validRecords = result.filter((record) => record.patient);
        res.render("records/record_list", { records: validRecords });
    } catch (error) {
        console.error(error);
        res.render("pages/error", { error: "Error fetching records" });
    }
};

const showRecordDetail = async (req, res) => {
    const recordId = req.params.id;
    try {
        const record = await Record.findById(recordId).populate("patient").populate("appointments.physio");

        if (!record) {
            return res.status(404).render("error", { error: "Record not found" });
        }

        if (req.user.role === "patient" && record.patient._id.toString() !== req.user._id.toString()) {
            return res.status(403).render("error", { error: "You don't have permission to view this record" });
        }

        res.render("records/record_detail", { record });
    } catch (error) {
        console.error(error);
        res.render("pages/error", { error: "Error retrieving the medical record" });
    }
};

const showAddRecord = async (req, res) => {
    try {
        const patients = await Patient.find();
        if (patients.length === 0) {
            return res.render("pages/error", { error: "No patients available." });
        }
        res.render("records/new_record", { patients });
    } catch (error) {
        console.error(error);
        res.render("pages/error", { error: "Error fetching patients" });
    }
};

const showAddAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        const record = await Record.findById(id);
        if (!record) {
            return res.status(404).send("Medical record not found");
        }
        const physiotherapists = await Physio.find();
        res.render("records/new_appointment", { record, physiotherapists });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal server error");
    }
};

const createAppointment = async (req, res) => {
    const { id } = req.params;
    const { date, physioId, diagnosis, treatment, observations } = req.body;
    try {
        const record = await Record.findById(id);
        if (!record) {
            return res.status(404).send("Medical record not found");
        }
        const newAppointment = { date, physio: physioId, diagnosis, treatment, observations };
        record.appointments.push(newAppointment);
        await record.save();
        res.redirect(`/records/${id}`);
    } catch (error) {
        let errors = {};
        if (error.errors) {
            for (const key in error.errors) {
                errors[key] = error.errors[key].message;
            }
        }
        if (error.code === 11000) {
            errors.generic = "There was an issue saving the appointment.";
        }
        const record = await Record.findById(id);
        const physiotherapists = await Physio.find();
        res.render("records/new_appointment", { errors, record, physiotherapists, appointment: { date, physioId, diagnosis, treatment, observations } });
    }
};

const addRecord = async (req, res) => {
    const { patient, medicalRecord } = req.body;
    if (!patient || !medicalRecord) {
        return res.render("records/new_record", { error: "Both patient and medical record are required." });
    }
    const newRecord = new Record({ patient, medicalRecord, appointments: [] });
    try {
        await newRecord.save();
        res.redirect("/records");
    } catch (error) {
        console.error(error);
        res.render("records/new_record", { error: "Error saving the medical record. Please try again." });
    }
};

const findRecordsBySurname = async (req, res) => {
    const { surname } = req.query;
    try {
        if (!surname || surname.trim() === "") {
            return showRecords(req, res);
        }

        const patients = await Patient.find({ surname: { $regex: `^${surname}`, $options: "i" } });

        if (patients.length === 0) {
            return res.render("records/record_list", { error: "No patients found with that surname." });
        }

        const patientIds = patients.map((patient) => patient._id);
        const records = await Record.find({ patient: { $in: patientIds } }).populate("patient");

        if (records.length === 0) {
            return res.render("records/record_list", { error: "No medical records for the found patients." });
        }

        res.render("records/record_list", { records });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Server error while searching for medical records." });
    }
};

const deleteRecordById = async (req, res) => {
    try {
        const result = await Record.findByIdAndDelete(req.params.id);
        if (result) {
            res.redirect("/records");
        } else {
            res.status(404).send({ error: "Record not found" });
        }
    } catch (error) {
        res.status(500).send({ error: "Server error" });
    }
};

module.exports = {
    showRecords,
    showRecordDetail,
    showAddRecord,
    addRecord,
    showAddAppointment,
    createAppointment,
    deleteRecordById,
    findRecordsBySurname,
};
