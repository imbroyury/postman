const express = require('express');
const path = require('path');
const server = express();
const bodyParser = require('body-parser');
const { writeRequestToFile, readAllRequests } = require('./requestStorage.js');
const { runRequest } = require('./requestRunner');

const PORT = 8280;

server.use(bodyParser.json());

const BUILD_FOLDER = path.join(__dirname, '..', 'build');

server.use(express.static(BUILD_FOLDER));

// API
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

server.get('/run-request', async (req, res) => {
  try {
    const { requestId } = req.query;

    if (!requestId) return res.status(400).send('Invalid request id provided');

    const result = await runRequest(requestId);
    res.send(result);
  } catch (e) {
    res.status(500).send('Failed to run request');
  }
});

// For everything else, server index file
server.get('*', function (req, res) {
  res.sendFile(path.join(BUILD_FOLDER, 'index.html'));
});

server.listen(PORT, function () {
  console.log(`Postman listening on port ${PORT}!`);
});