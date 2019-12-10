
import { useState } from 'react';

const getBlank = () => ({ key: '', value: ''});

const useKeyValuePairsArray = (initialCount = 1) => {
    const initialState = new Array(initialCount).fill(null).map(_ => getBlank());
    const [keyValuePairs, setKeyValuePairs] = useState(initialState);

    const handleKeyValuePairChange = (index, field, value) => {
        const newKeyValuePair = {
            ...keyValuePairs[index],
            [field]: value
        };

        const nextKeyValuePairs = [...keyValuePairs];
        nextKeyValuePairs[index] = newKeyValuePair;
        setKeyValuePairs(nextKeyValuePairs);
    };

    const addBlank = () => {
        const nextKeyValuePairs = [...keyValuePairs, getBlank()];
        setKeyValuePairs(nextKeyValuePairs);
    }

    return [keyValuePairs, handleKeyValuePairChange, addBlank];
};

export default useKeyValuePairsArray;
