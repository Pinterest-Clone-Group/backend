const jwt = require('jsonwebtoken');
const {
    AuthenticationError
} = require('../exceptions/index.exception.js');
const env = process.env;

module.exports = (req, res, next) => {
    const authentication = req.get('authentication');

    if (!authentication) {
        throw new AuthenticationError('Login Required for access.', 412);
    }

    try {
        const { userId } = jwt.verify(authentication, env.TOKEN_SECRETE_KEY);
        res.locals.user = userId;
        next();
    } catch (err) {
        next(err);
    }
};
