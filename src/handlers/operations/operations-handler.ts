import J from 'joi';
import { generateRandomString } from 'services/random/random-service';
import {
    addition,
    division,
    multiplication,
    squareRoot,
    subtraction,
    getOperations,
} from '../../services/operations/operations-service';
import { handlerWrapper } from '../../utils/wrapper';

/**
 * Generate a random string handler
 */
export const generateRandomStringHandler = handlerWrapper(
    {
        cors: true,
        validateToken: true,
    },
    async (event, manager) => {
        return await generateRandomString(event.userId, manager);
    },
);

/**
 * Addition handler
 */
export const additionHandler = handlerWrapper(
    {
        cors: true,
        validateToken: true,
        validateBody: J.object({
            number1: J.number().required(),
            number2: J.number().required(),
        }),
    },
    async (event, manager) => {
        const { number1, number2 } = event.body;
        return await addition(event.userId, number1, number2, manager);
    },
);

/**
 * Subtraction handler
 */
export const subtractionHandler = handlerWrapper(
    {
        cors: true,
        validateToken: true,
        validateBody: J.object({
            number1: J.number().required(),
            number2: J.number().required(),
        }),
    },
    async (event, manager) => {
        const { number1, number2 } = event.body;
        return await subtraction(event.userId, number1, number2, manager);
    },
);

/**
 * Multiplication handler
 */
export const multiplicationHandler = handlerWrapper(
    {
        cors: true,
        validateToken: true,
        validateBody: J.object({
            number1: J.number().required(),
            number2: J.number().required(),
        }),
    },
    async (event, manager) => {
        const { number1, number2 } = event.body;
        return await multiplication(event.userId, number1, number2, manager);
    },
);

/**
 * Division handler
 */
export const divisionHandler = handlerWrapper(
    {
        cors: true,
        validateToken: true,
        validateBody: J.object({
            number1: J.number().required(),
            number2: J.number().required(),
        }),
    },
    async (event, manager) => {
        const { number1, number2 } = event.body;
        return await division(event.userId, number1, number2, manager);
    },
);

/**
 * Square root handler
 */
export const squareRootHandler = handlerWrapper(
    {
        cors: true,
        validateToken: true,
        validateBody: J.object({
            number1: J.number().required(),
        }),
    },
    async (event, manager) => {
        const { number1 } = event.body;
        return await squareRoot(event.userId, number1, manager);
    },
);


/**
 * Get operations handler
 */
export const getOperationsHandler = handlerWrapper(
    {
        cors: true,
    },
    async (event, manager) => {
        const operations = await getOperations(manager);
        return { operations }
    },
);
