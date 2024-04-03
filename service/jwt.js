const jwt = require('jwt-simple');
const moment = require('moment');

//clave secreta
const secret = "CLAVE_SECRETA_de_la_RED_SOcial_951";


const createTokens = (user)=>{
    const payload= {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }

    return jwt.encode(payload, secret);
}

module.exports = {
    createTokens,
    secret
}