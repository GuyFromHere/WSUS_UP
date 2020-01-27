const express = require('express');

var app = express();
var PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// Import routes and give the server access to them.
var routes = require("./controllers/updates_controller");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

app.listen(PORT, function () {
    console.log('Server listening on: http://localhost:' + PORT);
}); 
