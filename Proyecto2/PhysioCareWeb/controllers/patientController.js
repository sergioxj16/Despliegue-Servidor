const Patient = require("../models/patient.js");
const User = require("../models/user.js");

const showPatients = (req, res) => {
  Patient.find()
    .then((result) => {
      res.render("patients/patient_list", { patients: result });
    })
    .catch(() => {
      res.render("error", { error: "Error fetching patients" });
    });
};

const showUpdatePatient = (req, res) => {
  Patient.findById(req.params["id"])
    .then((result) => {
      if (result) {
        res.render("patients/patient_edit", { patient: result });
      } else {
        res.render("error", { error: "Patient not found" });
      }
    });
};

const getPatientDetails = (req, res) => {
  Patient.findById(req.params["id"])
    .then((patient) => {
      if (!patient) {
        return res.render("error", { error: "Patient not found" });
      }

      User.findById(patient._id)
        .then((user) => {
          res.render("patients/patient_details", { patient, user });
        })
        .catch(() => {
          res.render("error", { error: "Error fetching associated user" });
        });
    });
};

const showAddPatient = (req, res) => {
  res.render("patients/new_patient");
};

const addPatient = async (req, res) => {
  const { name, surname, birthDate, address, insuranceNumber, login, password } = req.body;

  const patientData = {
    name,
    surname,
    birthDate,
    address,
    insuranceNumber,
    image: req.file ? req.file.filename : undefined,
  };

  const userData = {
    login,
    password,
    role: 'patient',
  };

  try {
    const newPatient = new Patient(patientData);
    const savedPatient = await newPatient.save();

    const newUser = new User({
      _id: savedPatient._id,
      login: userData.login,
      password: userData.password,
      role: userData.role,
    });

    await newUser.save();
    res.render("patients/patient_list", { patients: result });
  } catch (error) {
    const errors = error.errors || {};
    if (error.code === 11000) {
      errors.login = "Login already exists";
    }

    res.render("patients/new_patient", { errors, patient: patientData, user: userData });
  }
};

const editPatient = (req, res) => {
  const updateData = {
    name: req.body.name,
    surname: req.body.surname,
    birthDate: req.body.birthDate,
    address: req.body.address,
    insuranceNumber: req.body.insuranceNumber,
  };

  if (req.file && req.file.filename) {
    updateData.image = req.file.filename;
  }

  Patient.findByIdAndUpdate(req.params.id, updateData, { new: true })
    .then((updatedPatient) => {
      if (!updatedPatient) {
        return res.render("error", { error: "Patient not found" });
      }
      res.redirect(`/patients/${updatedPatient.id}`);
    })
    .catch((error) => {
      const errors = error.errors ? Object.keys(error.errors) : [];
      const message = errors.length > 0
        ? errors.map((key) => `<p>${error.errors[key].message}</p>`).join("")
        : "Error updating patient";
      res.render("error", { error: message });
    });
};

const findPatientBySurname = (req, res) => {
  const { surname } = req.query;

  const searchQuery = surname ? { surname: { $regex: surname, $options: "i" } } : {};

  Patient.find(searchQuery)
    .then((result) => {
      if (result.length === 0) {
        return res.render("patients/patient_list", { patients: [], message: "No patient found" });
      }
      return res.render("patients/patient_list", { patients: result });
    })
    .catch(() => {
      return res.status(500).send({ error: "Server error", result: null });
    });
};

const deletePatient = (req, res) => {
  Patient.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        return User.findByIdAndDelete(req.params.id);
      } else {
        throw new Error("Patient not found");
      }
    })
    .then(() => {
      res.redirect("/patients");
    })
    .catch((error) => {
      res.status("error", { error: error.message || "Cannot delete patient" });
    });
};

module.exports = {
  showPatients,
  showAddPatient,
  addPatient,
  findPatientBySurname,
  showUpdatePatient,
  getPatientDetails,
  deletePatient,
  editPatient,
};
