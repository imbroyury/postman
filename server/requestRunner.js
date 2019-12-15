import axios from 'axios';
import { readRequest } from './requestStorage';

const isNonEmptyString = (input) => typeof input === 'string' && input.length > 0;

const getQueryParamsString = queryParams => queryParams
    .filter(({ key, value }) => [key, value].every(isNonEmptyString))
    .reduce((searchParams, { key, value }) => {
        searchParams.append(key, value);
        return searchParams;
    }, new URLSearchParams());

const getHeadersStore = headers => headers
    .filter(({ key, value }) => [key, value].every(isNonEmptyString))
    .reduce((obj, { key, value }) => ({...obj, [key]: value}), {})

 export const runRequest = async (id) => {
    try {
        const request = await readRequest(id);

        const url = new URL(request.url);
        url.search = getQueryParamsString(request.queryParams);
        const restHeaders = getHeadersStore(request.headers);

        const config = {
            url: url.toString(),
            method: request.method,
            headers: {
                'Content-Type': request.contentType,
                ...restHeaders,
            },
            data: request.body,
            validateStatus: () => true, // don't throw on any responses
        };

        const response = await axios(config);

        return {
            status: response.status,
            contentType: response.headers['content-type'],
            headers: response.headers,
            body: response.data
        };
    } catch (e) {
        console.log('Error while running request');
        throw e;
    }
};
