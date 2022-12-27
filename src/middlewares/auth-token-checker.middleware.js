const env = process.env;
const { AuthenticationError } = require('../exceptions/index.exception.js');

module.exports = async (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];
        if (authorization) {
            throw new AuthenticationError('Already Logged in', 400);
        }
        next();
    } catch (err) {
        next(err);
    }
};