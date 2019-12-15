import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { writeRequestToFile, readAllRequests } from './requestStorage.js';
import { runRequest } from './requestRunner';
import { getIsRequestFormValid } from './formValidation.js';
const server = express();

const PORT = 8280;

server.use(bodyParser.json());

const BUILD_FOLDER = path.join(__dirname, '..', 'build');

server.use(express.static(BUILD_FOLDER));

// API
server.post('/add-request', async (req, res) => {
    try {
      const { body: form } = req;
      const isFormValid = getIsRequestFormValid(form);
      if (!isFormValid) {
        return res.status(400).send('Invalid form');
      }
      await writeRequestToFile(form);
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