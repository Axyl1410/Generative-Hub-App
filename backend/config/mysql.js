// const mysql = require('mysql2');

// // Create connection pool
// const db = mysql.createPool({
//     host: '127.0.0.1', // Your database host
//     user: 'root',      // Your MySQL username
//     password: 'root',      // Your MySQL password
//     database: 'generative_art_hub',  // Your database name
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// // Test connection
// db.getConnection((err) => {
//     if (err) {
//         console.error('MySQL connection failed:', err);
//     } else {
//         console.log('Connected to MySQL!');
//     }
// });

// module.exports = db;
// db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  } 
);

sequelize.authenticate()
  .then(() => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

module.exports = sequelize;

