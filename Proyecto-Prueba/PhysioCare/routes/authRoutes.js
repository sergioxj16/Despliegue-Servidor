const express = require("express");
const bcrypt = require("bcrypt");
const { generateToken } = require("../auth/auth");
const User = require("../models/user");
const router = express.Router();


router.post("/login", async (req, res) => {
    const { login, password } = req.body;

    try {
        const user = await User.findOne({ login });
        if (!user) {
            return res.status(401).json({ error: "Login incorrecto" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Login incorrecto" });
        }

        const token = generateToken(user);

        res.status(200).json({ result: token });
    } catch (error) {
        console.error("Error en /auth/login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
