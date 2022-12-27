require('dotenv').config();
const env = process.env;
const { createHmac } = require('node:crypto');

const hash = (password) => {
    return createHmac('sha256', env.CRYPTO_SECRETE_KEY)
        .update(password)
        .digest('hex');
};

module.exports = { hash };