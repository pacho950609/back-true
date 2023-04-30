import J from 'joi';
import { handlerWrapper } from 'utils/wrapper';
import {
    deleteRecord,
    getUserRecords,
    RecordFilters,
    getQueryNumberOfPages,
    getBalance,
} from 'services/record/record-service';
import { OperationType } from 'entities/Operation';
import { OperationResponse } from 'entities/Record';

/**
 * @api {delete} /v1/record/:recordId Delete record
 * @apiDescription Delete a record
 * @apiName deleteRecordHandler
 * @apiGroup Records
 * @apiHeader {String} Authorization User token
 * @apiPermission Client
 * @apiSuccessExample Success-Response:
 * {
        "response": "ok"
 * }
 */
export const deleteRecordHandler = handlerWrapper(
    {
        cors: true,
        validateToken: true,
        validatePathParameters: J.object({
            recordId: J.string().uuid().required(),
        }),
    },
    async (event, manager) => {
        await deleteRecord(event.userId, event.pathParameters.recordId, manager);
        return { response: 'ok' };
    },
);

/**
 * @api {get} /v1/records?recordsPerPage=2&page=1 Get records
 * @apiDescription Get a specific user page of records
 * @apiName getRecordsHandler
 * @apiGroup Records
 * @apiHeader {String} Authorization User token
 * @apiPermission Client
 * @apiQuery {Number} recordsPerPage Number of records per page.
 * @apiQuery {Number} page Page number.
 * @apiQuery {Date} [date] Date filter (ISO format).
 * @apiQuery {String="addition","subtraction","multiplication","division","randomString","squareRoot"} [type] Operation type filter.
 * @apiQuery {String="OK","ERROR"} [operationResponse] Operation response filter.
 * @apiQuery {String="date","type","operationResponse"} [orderByCol] Column to order.
 * @apiQuery {String="ASC","DESC"} [orderByType] How to order the column.
 * @apiSuccessExample Success-Response:
 * {
        "records": [
            {
                "id": "9b84779c-3ef6-49d6-ae82-8b4971eb1731",
                "type": "randomString",
                "userBalance": 2300,
                "operationResponse": "OK",
                "amount": 1500,
                "date": "2023-04-30T22:35:44.572Z"
            },
            {
                "id": "847d4ca2-221e-4052-be4e-c33ee815c295",
                "type": "addition",
                "userBalance": 1300,
                "operationResponse": "OK",
                "amount": 1000,
                "date": "2023-04-30T22:38:48.360Z"
            }
        ]
 * }
 */
export const getRecordsHandler = handlerWrapper(
    {
        cors: true,
        validateToken: true,
        validateQueryStringParameters: J.object({
            page: J.string().required(),
            recordsPerPage: J.string().required(),
            date: J.string().isoDate(),
            type: J.string().valid(...Object.values(OperationType)),
            operationResponse: J.string().valid(...Object.values(OperationResponse)),
            orderByCol: J.string().valid('date', 'type', 'operationResponse'),
            orderByType: J.string().valid('ASC', 'DESC'),
        }),
    },
    async (event, manager) => {
        const {
            page,
            recordsPerPage,
            date,
            type,
            operationResponse,
            orderByCol,
            orderByType,
        } = event.queryStringParameters;

        const records = await getUserRecords(
            event.userId,
            {
                page: Number(page),
                recordsPerPage: Number(recordsPerPage),
                date,
                type,
                operationResponse,
                orderBy: orderByCol
                    ? {
                          column: orderByCol,
                          type: orderByType,
                      }
                    : null,
            },
            manager,
        );
        return { records };
    },
);

/**
 * @api {get} /v1/records-number?recordsPerPage=2 Get pages and records
 * @apiDescription Get user number of pages and return first page of records
 * @apiName getRecordsQueryNumberOfPagesHandler
 * @apiGroup Records
 * @apiHeader {String} Authorization User token
 * @apiPermission Client
 * @apiQuery {Number} recordsPerPage Number of records per page.
 * @apiQuery {Date} [date] Date filter (ISO format).
 * @apiQuery {String="addition","subtraction","multiplication","division","randomString","squareRoot"} [type] Operation type filter.
 * @apiQuery {String="OK","ERROR"} [operationResponse] Operation response filter.
 * @apiQuery {String="date","type","operationResponse"} [orderByCol] Column to order.
 * @apiQuery {String="ASC","DESC"} [orderByType] How to order the column.
 * @apiSuccessExample Success-Response:
 * {
        "pages": 2,
        "records": [
            {
                "id": "9b84779c-3ef6-49d6-ae82-8b4971eb1731",
                "type": "randomString",
                "userBalance": 2300,
                "operationResponse": "OK",
                "amount": 1500,
                "date": "2023-04-30T22:35:44.572Z"
            },
            {
                "id": "847d4ca2-221e-4052-be4e-c33ee815c295",
                "type": "addition",
                "userBalance": 1300,
                "operationResponse": "OK",
                "amount": 1000,
                "date": "2023-04-30T22:38:48.360Z"
            }
        ]
 * }
 */
export const getRecordsQueryNumberOfPagesHandler = handlerWrapper(
    {
        cors: true,
        validateToken: true,
        validateQueryStringParameters: J.object({
            recordsPerPage: J.string().required(),
            date: J.string().isoDate(),
            type: J.string().valid(...Object.values(OperationType)),
            operationResponse: J.string().valid(...Object.values(OperationResponse)),
            orderByCol: J.string().valid('date', 'type', 'operationResponse'),
            orderByType: J.string().valid('ASC', 'DESC'),
        }),
    },
    async (event, manager) => {
        const { recordsPerPage, date, type, operationResponse, orderByCol, orderByType } = event.queryStringParameters;

        return await getQueryNumberOfPages(
            event.userId,
            {
                recordsPerPage: Number(recordsPerPage),
                date,
                type,
                operationResponse,
                orderBy: orderByCol
                    ? {
                          column: orderByCol,
                          type: orderByType,
                      }
                    : null,
            },
            manager,
        );
    },
);

/**
 * @api {get} /v1/balance Get balance
 * @apiDescription Get user balance
 * @apiName getBalanceHandler
 * @apiGroup Records
 * @apiHeader {String} Authorization User token
 * @apiPermission Client
 * @apiSuccessExample Success-Response:
 * {
        "balance": 200,
 * }
 */
export const getBalanceHandler = handlerWrapper(
    {
        cors: true,
        validateToken: true,
    },
    async (event, manager) => {
        const balance = await getBalance(event.userId, manager);
        return { balance };
    },
);
