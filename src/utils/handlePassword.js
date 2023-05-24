import bcryptjs from "bcryptjs";

/**
 * Contraseña sin encriptar: Hola123
 * @param {} passwordPlain
 */
const encrypt = async (passwordPlain) => {
    const hash = await bcryptjs.hash(passwordPlain, 10);

    return hash;
}

/**
 * Pasará la constraseña sin encriptar y pasa la contraseña
 * la constraseña encriptada
 * @param {*} passwordPlain
 * @param {*} hashPassword 
 */
const compare = async (passwordPlain, hashPassword) => {
    return await bcryptjs.compare(passwordPlain, hashPassword)
}

module.exports = {encrypt, compare}