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
 * @api {post} /v1/random-string Generate random string
 * @apiDescription Generate a random string and create a record
 * @apiName generateRandomStringHandler
 * @apiGroup Operations
 * @apiHeader {String} Authorization User token
 * @apiPermission Client
 * @apiSuccessExample Success-Response:
 * {
        "operationRes": "azsftsvpjn",
        "record": {
            "id": "9b84779c-3ef6-49d6-ae82-8b4971eb1731",
            "operationId": "f4b0ece8-b39c-4fa4-9e4c-20d116cb4c40",
            "userId": "090fcd14-9352-4a57-9ebd-fc9382b28157",
            "amount": 1500,
            "userBalance": 2300,
            "operationResponse": "OK",
            "date": "2023-04-30T22:35:44.572Z",
            "deleted": false
        }
 * }
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
 * @api {post} /v1/addition Addition operation
 * @apiDescription Make an addition operation and create a record
 * @apiName additionHandler
 * @apiGroup Operations
 * @apiHeader {String} Authorization User token
 * @apiPermission Client
 * @apiBody {Number} number1 First operation number.
 * @apiBody {Number} number2 Second operation number.
 * @apiParamExample {json} Body-Example:
 *  {
        "number1": 10,
        "number2": 2
 *  } 
 * @apiSuccessExample Success-Response:
 * {
        "operationRes": 12,
        "record": {
            "id": "9b84779c-3ef6-49d6-ae82-8b4971eb1731",
            "operationId": "f4b0ece8-b39c-4fa4-9e4c-20d116cb4c40",
            "userId": "090fcd14-9352-4a57-9ebd-fc9382b28157",
            "amount": 1500,
            "userBalance": 2300,
            "operationResponse": "OK",
            "date": "2023-04-30T22:35:44.572Z",
            "deleted": false
        }
 * }
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
 * @api {post} /v1/subtraction Subtraction operation
 * @apiDescription Make a subtraction operation and create a record
 * @apiName subtractionHandler
 * @apiGroup Operations
 * @apiHeader {String} Authorization User token
 * @apiPermission Client
 * @apiBody {Number} number1 First operation number.
 * @apiBody {Number} number2 Second operation number.
 * @apiParamExample {json} Body-Example:
 *  {
        "number1": 14,
        "number2": 2
 *  } 
 * @apiSuccessExample Success-Response:
 * {
        "operationRes": 12,
        "record": {
            "id": "9b84779c-3ef6-49d6-ae82-8b4971eb1731",
            "operationId": "f4b0ece8-b39c-4fa4-9e4c-20d116cb4c40",
            "userId": "090fcd14-9352-4a57-9ebd-fc9382b28157",
            "amount": 1500,
            "userBalance": 2300,
            "operationResponse": "OK",
            "date": "2023-04-30T22:35:44.572Z",
            "deleted": false
        }
 * }
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
 * @api {post} /v1/multiplication Multiplication operation
 * @apiDescription Make a multiplication operation and create a record
 * @apiName multiplicationHandler
 * @apiGroup Operations
 * @apiHeader {String} Authorization User token
 * @apiPermission Client
 * @apiBody {Number} number1 First operation number.
 * @apiBody {Number} number2 Second operation number.
 * @apiParamExample {json} Body-Example:
 *  {
        "number1": 10,
        "number2": 2
 *  } 
 * @apiSuccessExample Success-Response:
 * {
        "operationRes": 20,
        "record": {
            "id": "9b84779c-3ef6-49d6-ae82-8b4971eb1731",
            "operationId": "f4b0ece8-b39c-4fa4-9e4c-20d116cb4c40",
            "userId": "090fcd14-9352-4a57-9ebd-fc9382b28157",
            "amount": 1500,
            "userBalance": 2300,
            "operationResponse": "OK",
            "date": "2023-04-30T22:35:44.572Z",
            "deleted": false
        }
 * }
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
 * @api {post} /v1/division Division operation
 * @apiDescription Make a division operation and create a record
 * @apiName divisionHandler
 * @apiGroup Operations
 * @apiHeader {String} Authorization User token
 * @apiPermission Client
 * @apiBody {Number} number1 First operation number.
 * @apiBody {Number} number2 Second operation number.
 * @apiParamExample {json} Body-Example:
 *  {
        "number1": 10,
        "number2": 2
 *  } 
 * @apiSuccessExample Success-Response:
 * {
        "operationRes": 5,
        "record": {
            "id": "9b84779c-3ef6-49d6-ae82-8b4971eb1731",
            "operationId": "f4b0ece8-b39c-4fa4-9e4c-20d116cb4c40",
            "userId": "090fcd14-9352-4a57-9ebd-fc9382b28157",
            "amount": 1500,
            "userBalance": 2300,
            "operationResponse": "OK",
            "date": "2023-04-30T22:35:44.572Z",
            "deleted": false
        }
 * }
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
 * @api {post} /v1/square-root Square root operation
 * @apiDescription Make a square root operation and create a record
 * @apiName squareRootHandler
 * @apiGroup Operations
 * @apiHeader {String} Authorization User token
 * @apiPermission Client
 * @apiBody {Number} number1 First operation number.
 * @apiParamExample {json} Body-Example:
 *  {
        "number1": 9
 *  } 
 * @apiSuccessExample Success-Response:
 * {
        "operationRes": 3,
        "record": {
            "id": "9b84779c-3ef6-49d6-ae82-8b4971eb1731",
            "operationId": "f4b0ece8-b39c-4fa4-9e4c-20d116cb4c40",
            "userId": "090fcd14-9352-4a57-9ebd-fc9382b28157",
            "amount": 1500,
            "userBalance": 2300,
            "operationResponse": "OK",
            "date": "2023-04-30T22:35:44.572Z",
            "deleted": false
        }
 * }
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
 * @api {get} /v1/operations Get Operations
 * @apiDescription Return system operations and their cost
 * @apiName getOperationsHandler
 * @apiGroup Operations
 * @apiSuccessExample Success-Response:
 * {
        "operations": [
            {
                "type": "addition",
                "cost": 1000
            },
            {
                "type": "subtraction",
                "cost": 2000
            }
        ]
 * }
 */
export const getOperationsHandler = handlerWrapper(
    {
        cors: true,
    },
    async (event, manager) => {
        const operations = await getOperations(manager);
        return { operations };
    },
);
