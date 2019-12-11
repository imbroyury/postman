const express = require('express');
const path = require('path');
const server = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { writeRequestToFile, readAllRequests } = require('./requestStorage.js');
const PORT = 8280;

server.use(bodyParser.json());
server.use(cors());

const BUILD_FOLDER = path.join(__dirname, '..', 'build');

server.use(express.static(BUILD_FOLDER));

server.get('/', function (req, res) {
  res.sendFile(path.join(BUILD_FOLDER, 'index.html'));
});

server.post('/add-request', async (req, res) => {
    try {
      await writeRequestToFile(req.body);
      res.send('Request successfully saved');
    } catch(e) {
      res.status(500).send('Unable to save request');
    }
});

server.get('/get-all-requests', async (req, res) => {
  try {
    const allRequests = await readAllRequests();
    res.send(allRequests);
  } catch(e) {
    res.status(500).send('Unable to read all requests');
  }
});

server.listen(PORT, function () {
  console.log(`Postman listening on port ${PORT}!`);
});