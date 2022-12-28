require('dotenv').config();
const env = process.env;

const development = {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    host: env.DB_END_POINT,
    port: process.env.DB_PORT,
    dialect: 'mysql',
};

module.exports = { development };