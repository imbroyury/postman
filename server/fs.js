const fsp = require('fs').promises;
const path = require('path');

const REQUESTS_FOLDER = path.resolve(__dirname, 'server', 'requests');

const writeJSON = async (path, json) => {
    try {
        await fsp.writeFile(path, json);
    } catch (e) {
        console.error('Unable to write to file', path);
    }
};

const readJSON = async (path) => {
    try {
        const contents = await fsp.readFile(path);
        return contents;
    } catch (e) {
        console.error('Unable to read file', path);
    }
};

module.exports = {
    writeJSON,
    readJSON,
}