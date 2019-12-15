import { formInputs } from "./formInputs";
import { contentTypes } from "./contentTypes";
import { requestMethods } from "./requestMethods";

const isString = input => typeof input === 'string';
const isArray = input => Array.isArray(input);
const isKeyValueObject = input => typeof input === 'object' &&
  Object.getOwnPropertyNames(input).filter(pn => !['key', 'value'].includes(pn)).length === 0

export const inputValidators = {
  [formInputs.url]: (value) => isString(value) &&
    new RegExp(/^((?:http:\/\/)|(?:https:\/\/))(www.)?((?:[a-zA-Z0-9-]+\.[a-z]{2,3})|(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d+)?))([\/a-zA-Z0-9\.]*)$/) // eslint-disable-line no-useless-escape
      .test(value),
  [formInputs.contentType]: (value) => contentTypes.includes(value),
  [formInputs.method]: (value) => requestMethods.includes(value),
  [formInputs.queryParams]: (value) => isArray(value) && value.every(isKeyValueObject),
  [formInputs.headers]: (value) => isArray(value) && value.every(isKeyValueObject),
};
