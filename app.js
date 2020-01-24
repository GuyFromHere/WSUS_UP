const express = require('express');
const app = express();
const port = 3001;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// api router
app.use('/', require('./public/routes/index'));

app.listen(port, () => console.log(`Server started on port ${port}`));