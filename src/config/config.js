require('dotenv').config();
const env = process.env;

const development = {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    host: env.MYSQL_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
};
const test = {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE_TEST,
    host: env.MYSQL_HOST,
    dialect: 'mysql',
};
const production = {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
};

module.exports = { development, production, test };

// 1. npx sequelize db:drop --config ./src/config/config.js  
// 2. npx sequelize db:create --config ./src/config/config.js
// 3. npx sequelize db:migrate --config ./src/config/config.js --migrations-path ./src/migrations --models-path ./src/models