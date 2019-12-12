const axios = require('axios');
const { readRequest } = require('./requestStorage');

const resolveQueryParams = queryParams => {
    const queryString = queryParams
        .filter(({ key, value }) => Boolean(key && value))
        .map(({ key, value }) => `${key}=${value}`)
        .join('&');
    
    return queryString;
}

const runRequest = async (id) => {
    const request = await readRequest(id);

    const url = `${request.requestUrl}?${resolveQueryParams(request.queryParams)}`;

    console.log(url);

    const config = {
        method: request.requestMethod,
        url,
        data: request.requestBody,
        headers: {
            'Content-Type': request.contentType,
        }
    };

    const result = await axios(config);

    console.log(request);
    console.log(result);
    return result.data;
};

module.exports = {
    runRequest,
}