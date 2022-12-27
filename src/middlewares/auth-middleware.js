const jwt = require('jsonwebtoken');
const {
    AuthenticationError
} = require('../exceptions/index.exception.js');
const env = process.env;

module.exports = (req, res, next) => {
    const authorization = req.headers['authorization'];

    if (!authorization) {
        throw new AuthenticationError('Login Required for access.', 412);
    }

    try {
        const { userId } = jwt.verify(authorization, env.TOKEN_SECRETE_KEY);
        res.locals.userId = userId;
        next();
    } catch (err) {
        next(err);
    }
};
