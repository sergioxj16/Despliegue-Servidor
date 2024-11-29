const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("Faltan variables de entorno requeridas. Verifica .env");
    process.exit(1);
}

const generateToken = (user) => {

    return jwt.sign({
        id: user._id,
        login: user.login,
        rol: user.rol
    }, JWT_SECRET
        , { expiresIn: "20h" });
};

let verifyToken = (token) => {
    try {
        let result = jwt.verify(token, JWT_SECRET);
        return result;
    } catch (error) {
        return null;
    }
};

const protectRoute = (allowedRoles) => {
    return (req, res, next) => {
        let token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ ok: false, error: "Token no proporcionado o inválido" });
        }

        token = token.slice(7); 
        const valid = verifyToken(token);

        if (!valid) {
            return res.status(401).json({ ok: false, error: "Token inválido o expirado" });
        }

        req.user = valid; 

        if (!allowedRoles.includes(valid.rol)) {
            return res.status(403).json({ ok: false, error: "Acceso no autorizado" });
        }

        next(); 
    };
};

module.exports = {
    generateToken,
    verifyToken,
    protectRoute
};
