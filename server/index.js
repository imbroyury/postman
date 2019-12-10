const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { writeRequestToFile, readAllRequests } = require('./requestStorage.js');
const PORT = 8280;

app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/add-request', async (req, res) => {
    try {
      await writeRequestToFile(req.body);
      res.send('Request successfully saved');
    } catch(e) {
      res.status(500).send('Unable to save request');
    }
});

app.get('/get-all-requests', async (req, res) => {
  try {
    const allRequests = await readAllRequests();
    res.send(allRequests);
  } catch(e) {
    res.status(500).send('Unable to read all requests');
  }
});

app.listen(PORT, function () {
  console.log(`Postman listening on port ${PORT}!`);
});