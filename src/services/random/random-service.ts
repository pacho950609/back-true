import { generateRandomStringRequest } from 'integrations/random';
import { EntityManager } from 'typeorm';
import { Operation, OperationType } from 'entities/Operation';
import { Record, OperationResponse } from 'entities/Record';
import { createRecord } from 'services/record/record-service';

/**
 * Generate a random string
 * @param userId userId
 * @param manager db connection
 * @returns
 */
export const generateRandomString = async (userId: string, manager: EntityManager) => {
    const res = await generateRandomStringRequest(1);
    const operationRes = res.result?.random?.data?.[0];
    const record = await createRecord(userId, OperationType.RANDOM_STRING, manager);
    return { operationRes, record };
};