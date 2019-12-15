import { promises as fsp } from 'fs';
import path from 'path';
import uuidv4 from 'uuid/v4';

const REQUESTS_FOLDER = path.join(__dirname, 'requests');
const IGNORE = ['.gitkeep'];

const writeJSON = async (pathToFile, json) => {
    try {
        await fsp.writeFile(pathToFile, json);
    } catch (e) {
        console.error('Unable to write to file', pathToFile);
        throw e;
    }
};

const readJSON = async (pathToFile) => {
    try {
        const contents = await fsp.readFile(pathToFile);
        return JSON.parse(contents);
    } catch (e) {
        console.error('Unable to read JSON', pathToFile);
        throw e;
    }
};

export const writeRequestToFile = async (request) => {
    const uuid = uuidv4();
    const req = {
        _id: uuid,
        ...request,
    };
    const json = JSON.stringify(req, null, 2);
    const filename = `${uuid}.json`;
    const pathToFile = path.join(REQUESTS_FOLDER, filename);
    await writeJSON(pathToFile, json);
    return uuid;
};

export const readRequest = async (requestId) => {
    const filename = `${requestId}.json`;
    const pathToFile = path.join(REQUESTS_FOLDER, filename);
    const contents = await readJSON(pathToFile);
    return contents;
};

export const readAllRequests = async () => {
    const list = await fsp.readdir(REQUESTS_FOLDER);
    const toRead = list.filter(item => !IGNORE.includes(item));
    const promisedReads = toRead.map(
        (filename) => readJSON(path.join(REQUESTS_FOLDER, filename))
            .catch(() => null) // nullify read errors
    );
    const result = (await Promise.all(promisedReads)).filter(r => r !== null);
    return result;
};
