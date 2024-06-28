const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    host: 'localhost',
    port: 5432, 
    dialect: 'postgres',
    username: 'adminpint',
    password: 'softshares',
    database: 'postgres',
    logging: console.log, // Enable logging to see SQL queries
});

module.exports = sequelize;
