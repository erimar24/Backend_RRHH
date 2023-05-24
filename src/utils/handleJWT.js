const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Generar el token y este va a recibir un objeto del usuario
 * @param {*} user 
 */
const tokenSign = async (user) => {
        const sign = jwt.sign({
            _id: user._id,
            cargo: user.cargo
        },
        JWT_SECRET,
        {
            //Tiempo de expiración del token
            expiresIn: "2h",
        }
    )

    //Retornamos el token
    return sign;
};

/**
 * Debes pasar el objeto del usuario para verificar el token
 * @param {*} tokenJWT 
 * @returns 
 */
const verifyToken = async (tokenJWT) => {
    try {
        return jwt.verify(tokenJWT, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

module.exports = { tokenSign, verifyToken};