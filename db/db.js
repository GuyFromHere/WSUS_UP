const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "dbUser",
    password: "How do you like my password?",
    database: "WSUS_UP",
    multipleStatements: true
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to db.')
});

module.exports = connection;
