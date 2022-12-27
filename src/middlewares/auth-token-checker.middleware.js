const env = process.env;
const { AuthenticationError } = require('../exceptions/index.exception.js');

module.exports = async (req, res, next) => {
    try {
        const authentication = req.get('authentication');
        if (authentication) {
            throw new AuthenticationError('Already Logged in', 400);
        }
        next();
    } catch (err) {
        next(err);
    }
};