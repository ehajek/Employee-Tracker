const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'dba',
  password: 'micewithaScarf129!',
  database: 'emptrack'
});

module.exports = db;
