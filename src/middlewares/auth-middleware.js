const jwt = require('jsonwebtoken');
require('dotenv').config();
const {
    AuthenticationError
} = require('../exceptions/index.exception.js');
const env = process.env;

module.exports = (req, res, next) => {
    const authorization = req.headers['authorization'];

    const [authType, authToken] = (authorization || "").split(" ");

    if (!authorization) {
        throw new AuthenticationError('Login Required for access.', 401);
    }

    try {
        if (authToken && authType === "Bearer") {
            const { userId } = jwt.verify(authToken, env.TOKEN_SECRETE_KEY);
            res.locals.userId = userId;
        }
        
        next();
    } catch (err) {
        next(err);
    }
};
