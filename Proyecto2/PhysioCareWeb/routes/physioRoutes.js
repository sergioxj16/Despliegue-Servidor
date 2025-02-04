const express = require("express");
const router = express.Router();
const physioController = require("../controllers/physioController.js");
const { allowedRoles } = require("../utils/auth.js");
const upload = require("../utils/uploads.js");

router.post("/", allowedRoles("admin"), upload.upload.single("image"), physioController.addPhysio);
router.post("/:id", allowedRoles("admin"), upload.upload.single("image"), physioController.editPhysio);

router.get("/", allowedRoles("admin", "physio", "patient"), physioController.showPhysios);
router.get("/new", allowedRoles("admin"), physioController.showAddPhysio);
router.get("/find", allowedRoles("admin"), physioController.findPhysioBySpecialty);
router.get("/edit/:id", allowedRoles("admin"), physioController.showEditPhysio);
router.get("/:id", allowedRoles("admin", "physio", "patient"), physioController.getPhysioDetails);
router.get("/findSurname", allowedRoles("admin"), physioController.findPhysioBySurname);


router.delete("/:id", allowedRoles("admin"), physioController.deletePhysio);

module.exports = router;


