const jwt = require('jsonwebtoken');
require('dotenv').config();
const env = process.env;

let tokenObject = {};

function createToken(id, duration) {
    return jwt.sign({ userId: id }, env.TOKEN_SECRETE_KEY, {
        expiresIn: duration,
    });
}

module.exports = { tokenObject, createToken };