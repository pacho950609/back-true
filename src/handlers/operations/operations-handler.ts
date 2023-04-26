import J from 'joi';
import {
    addition,
    division,
    generateRandomString,
    multiplication,
    squareRoot,
    subtraction,
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
        const response = await generateRandomString(event.userId, manager);
        return { response };
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
        const response = await addition(event.userId, number1, number2, manager);
        return { response };
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
        const response = await subtraction(event.userId, number1, number2, manager);
        return { response };
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
        const response = await multiplication(event.userId, number1, number2, manager);
        return { response };
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
        const response = await division(event.userId, number1, number2, manager);
        return { response };
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
        const response = await squareRoot(event.userId, number1, manager);
        return { response };
    },
);
