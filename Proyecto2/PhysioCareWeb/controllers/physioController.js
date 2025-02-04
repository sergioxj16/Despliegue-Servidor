const Physio = require("../models/physio.js");
const User = require("../models/user.js");

const showPhysios = async (req, res) => {
  try {
    const result = await Physio.find();
    res.render("physios/physio_list", { physios: result });
  } catch (error) {
    res.render("pages/error", { error: "An error occurred while fetching physios." });
  }
};

const findPhysioBySpecialty = async (req, res) => {
  const { specialty } = req.query;

  try {
    let physios;
    if (!specialty) {
      physios = await Physio.find();
      if (physios.length === 0) {
        return res.status(404).render("physios/physio_list", {
          error: "No physios registered.",
          physios: [],
        });
      }
    } else {
      physios = await Physio.find({ specialty });
      if (physios.length === 0) {
        return res.status(404).render("physios/physio_list", {
          error: "No physio found with the given specialty.",
          physios: [],
        });
      }
    }
    return res.render("physios/physio_list", { physios });
  } catch (error) {
    return res.status(500).render("physios/physio_list", {
      error: "Server error.",
      physios: [],
    });
  }
};

const findPhysioBySurname = async (req, res) => {
  let { surname } = req.query;
  surname = surname ? surname.trim() : "";

  try {
    if (!surname) {
      return showPhysios(req, res);
    }

    if (typeof surname !== 'string' || surname === "") {
      return res.render("physios/physio_list", { error: "Invalid surname provided." });
    }

    const physios = await Physio.find({ surname: { $regex: surname, $options: "i" } });

    if (physios.length === 0) {
      return res.render("physios/physio_list", { error: "No physios found with that surname." });
    }

    res.render("physios/physio_list", { physios });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error while searching for physios." });
  }
};

const showAddPhysio = (req, res) => {
  res.render("physios/new_physio");
};

const getPhysioDetails = async (req, res) => {
  try {
    const result = await Physio.findById(req.params["id"]);
    if (result) {
      res.render("physios/physio_details", { physio: result });
    } else {
      res.render("pages/error", { error: "Physio not found." });
    }
  } catch (error) {
    res.render("pages/error", { error: "Error finding physio." });
  }
};

const showEditPhysio = async (req, res) => {
  try {
    const result = await Physio.findById(req.params["id"]);
    if (result) {
      res.render("physios/physio_edit", { physio: result });
    } else {
      res.render("pages/error", { error: "Physio not found." });
    }
  } catch (error) {
    res.render("pages/error", { error: "Error finding physio." });
  }
};

const deletePhysio = async (req, res) => {
  try {
    const result = await Physio.findByIdAndDelete(req.params.id);
    if (result) {
      await User.findByIdAndDelete(req.params.id);
      res.redirect("/physios");
    } else {
      throw new Error("Physio not found.");
    }
  } catch (error) {
    res.status(500).send({
      error: error.message || "Cannot delete physio or user.",
    });
  }
};

const addPhysio = async (req, res) => {
  const { name, surname, specialty, licenseNumber, login, password } = req.body;

  let physioData = {
    name,
    surname,
    specialty,
    licenseNumber,
    image: req.file ? req.file.filename : undefined,
  };

  let userData = {
    login,
    password,
    rol: 'physio',
  };

  try {
    const newPhysio = new Physio(physioData);
    const savedPhysio = await newPhysio.save();

    const newUser = new User({
      _id: savedPhysio._id,
      login: userData.login,
      password: userData.password,
      rol: userData.rol,
    });

    await newUser.save();

    res.redirect(req.baseUrl);
  } catch (error) {
    let errors = {};

    if (error.errors) {
      for (const key in error.errors) {
        errors[key] = error.errors[key].message;
      }
    }

    if (error.code === 11000) {
      errors.login = "The login already exists.";
    }

    res.render("physios/new_physio", {
      errors,
      physio: physioData,
      user: userData,
    });
  }
};

const editPhysio = async (req, res) => {
  const updateData = {
    name: req.body.name,
    surname: req.body.surname,
    specialty: req.body.specialty,
    licenseNumber: req.body.licenseNumber,
  };

  if (req.file && req.file.filename) {
    updateData.image = req.file.filename;
  }

  try {
    await Physio.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    res.redirect(req.baseUrl);
  } catch (error) {
    const errors = error.errors ? Object.keys(error.errors) : [];
    const message = errors.length > 0
      ? errors.map((key) => `<p>${error.errors[key].message}</p>`).join("")
      : "An error occurred while updating the physio.";
    res.render("pages/error", { error: message });
  }
};

module.exports = {
  showPhysios,
  findPhysioBySpecialty,
  getPhysioDetails,
  showEditPhysio,
  deletePhysio,
  showAddPhysio,
  addPhysio,
  editPhysio,
  findPhysioBySurname
};
