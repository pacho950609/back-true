import { EntityManager } from 'typeorm';
import { createRecord } from 'services/record/record-service';
import { generateRandomStringRequest } from '../../integrations/random';
import { OperationResponse, Record } from '../../entities/Record';
import { Operation, OperationType } from '../../entities/Operation';

/**
 * Generate a random string
 * @param userId userId
 * @param manager db connection
 * @returns
 */
export const generateRandomString = async (userId: string, manager: EntityManager): Promise<string> => {
    const res = await generateRandomStringRequest(1);
    const randomString = res.result?.random?.data?.[0];
    const generateStringOperation = await manager.findOne(Operation, { where: { type: OperationType.RANDOM_STRING } });
    if (randomString) {
        const record = new Record({
            operationId: generateStringOperation.id,
            userId,
            amount: 13,
            userBalance: 123123,
            operationResponse: OperationResponse.OK,
        });
        await manager.save(record);
    }
    return randomString;
};

/**
 * Execute an addition operation
 * @param userId userId
 * @param number1 number to operate
 * @param number2 number2 to operate
 * @param manager db connection
 * @returns
 */
export const addition = async (
    userId: string,
    number1: number,
    number2: number,
    manager: EntityManager,
) => {
    const operationRes = number1 + number2;
    const record = await createRecord(userId, OperationType.ADDITION, manager);
    return {operationRes, record};
};

/**
 * Execute a subtraction operation
 * @param userId userId
 * @param number1 number to operate
 * @param number2 number2 to operate
 * @param manager db connection
 * @returns
 */
export const subtraction = async (
    userId: string,
    number1: number,
    number2: number,
    manager: EntityManager,
) => {
    const operationRes = number1 - number2;
    const record =await createRecord(userId, OperationType.SUBTRACTION, manager);
    return {operationRes, record};
};

/**
 * Execute a multiplication operation
 * @param userId userId
 * @param number1 number to operate
 * @param number2 number2 to operate
 * @param manager db connection
 * @returns
 */
export const multiplication = async (
    userId: string,
    number1: number,
    number2: number,
    manager: EntityManager,
) => {
    const operationRes = number1 * number2;
    const record = await createRecord(userId, OperationType.MULTIPLICATION, manager);
    return {operationRes, record};
};

/**
 * Execute a division operation
 * @param userId userId
 * @param number1 number to operate
 * @param number2 number2 to operate
 * @param manager db connection
 * @returns
 */
export const division = async (
    userId: string,
    number1: number,
    number2: number,
    manager: EntityManager,
) => {
    const operationRes = number1 / number2;
    const record = await createRecord(userId, OperationType.DIVISION, manager);
    return {operationRes, record};
};

/**
 * Execute a square root operation
 * @param userId userId
 * @param number1 number to operate
 * @param manager db connection
 * @returns
 */
export const squareRoot = async (userId: string, number1: number, manager: EntityManager) => {
    const operationRes = Math.sqrt(number1);
    const record = await createRecord(userId, OperationType.SQUARE_ROOT, manager);
    return {operationRes, record};
};
