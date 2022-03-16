// this file helps us connect to the data base

// import the Sequelize constructor from the library
const Sequelize = require('sequelize');
// required to pass in environmental varibles
require('dotenv').config();

// create connection to our database, pass in your MySQL information for username and password
// .env is bringing in the environmental variables created in that file
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW,{
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

module.exports = sequelize;