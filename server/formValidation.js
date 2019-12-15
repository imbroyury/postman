import { formInputs } from "../src/shared/formInputs";
import { inputValidators } from "../src/shared/inputValidators";

const isFunction = input => typeof input === 'function';

export const getIsRequestFormValid = (form) => {
    const inputNames = Object.values(formInputs);
    const formFields = Object.keys(form);

    const undeclaredFields = formFields.filter(ff => !inputNames.includes(ff));
    if (undeclaredFields.length > 0) {
        console.log('Form contains undeclared fields');
        return false;
    }

    return inputNames.every(inputName => {
        const value = form[inputName];
        const validator = inputValidators[inputName];
        if (isFunction(validator)) {
            return validator(value);
        }
        return true; // no validator - allow everything;
    });
};