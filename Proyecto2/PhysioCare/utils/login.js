// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authRoutes = require("./routes/auth");
const router = express.Router();

app.use("/auth", authRoutes);

// Ruta POST /login
router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const user = await User.findOne({ login });
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                result: null,
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                error: 'Contraseña incorrecta',
                result: null,
            });
        }

        const payload = {
            id: user._id,
            rol: user.rol,
        };

        const token = jwt.sign(payload, 'tu_clave_secreta', { expiresIn: '1h' });

        res.status(200).json({
            error: '',
            result: { token },
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error interno del servidor',
            result: null,
        });
    }
});

module.exports = router;
