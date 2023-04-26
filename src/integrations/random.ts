import axios from 'axios';

export enum RandomMethods {
    GENERATE_STRINGS = 'generateStrings',
}

const { RANDOM_URL, RANDOM_KEY } = process.env;
const jsonrpc = '2.0';

interface RandomStringResult {
    result: { random: { data: string[] } };
}

/**
 * Make a request to random.org to generate a list of random string.
 * @param numberOfStrings number of strings that you want to generate.
 * @returns The list of generated random strings.
 */
export const generateRandomStringRequest = async (numberOfStrings: number): Promise<RandomStringResult> => {
    const res = await axios.post<RandomStringResult>(RANDOM_URL, {
        jsonrpc,
        method: RandomMethods.GENERATE_STRINGS,
        params: {
            apiKey: RANDOM_KEY,
            n: numberOfStrings,
            length: 10,
            characters: 'abcdefghijklmnopqrstuvwxyz',
        },
        id: 1,
    });
    return res.data;
};
