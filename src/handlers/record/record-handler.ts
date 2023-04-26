import J from 'joi';
import { handlerWrapper } from 'utils/wrapper';
import { deleteRecord, getUserRecords, RecordFilters, getQueryNumberOfPages } from 'services/record/record-service';
import { OperationType } from 'entities/Operation';
import { OperationResponse } from 'entities/Record';

/**
 * Delete record handler
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
 * Get user records handler
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
 * Get query number of pages handler
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
