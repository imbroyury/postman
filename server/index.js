const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const PORT = 8280;

app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/add-request', function (req, res) {
    console.log(req.body);
});

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});