const jwt = require('jsonwebtoken');
require('dotenv').config();
const env = process.env;

let tokenObject = {};

function createAccessToken(id, duration) {
    return jwt.sign({ userId: id }, env.TOKEN_SECRETE_KEY, {
        expiresIn: duration,
    });
}

function createRefreshToken(duration) {
    return jwt.sign({}, env.TOKEN_SECRETE_KEY, {
        expiresIn: duration,
    });
}

module.exports = { tokenObject, createAccessToken, createRefreshToken};