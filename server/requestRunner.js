const axios = require('axios');
const { readRequest } = require('./requestStorage');

const isNonEmptyString = (input) => typeof input === 'string' && input.length > 0;

const getQueryParamsString = queryParams => queryParams
    .filter(({ key, value }) => [key, value].every(isNonEmptyString))
    .map(({ key, value }) => `${key}=${value}`)
    .join('&');

const getHeadersStore = headers => headers
    .filter(({ key, value }) => [key, value].every(isNonEmptyString))
    .reduce((obj, { key, value }) => ({...obj, [key]: value}), {})

const runRequest = async (id) => {
    try {
        const request = await readRequest(id);

        const url = `${request.url}?${getQueryParamsString(request.queryParams)}`;
        const restHeaders = getHeadersStore(request.headers);

        const config = {
            url,
            method: request.method,
            headers: {
                'Content-Type': request.contentType,
                ...restHeaders,
            },
            data: request.body,
            validateStatus: () => true, // don't throw on any responses
        };

        const response = await axios(config);

        console.log(response.status);
        return {
            status: response.status,
            headers: response.headers,
            body: response.data
        };

    // http-код ответа;
    // формат тела ответа (Content-Type);
    // тело ответа;
    // заголовки ответа;
    // по возможности — превью тела ответа.
    } catch (e) {
        console.log('Error while running request');
        throw e;
    }
};

module.exports = {
    runRequest,
}