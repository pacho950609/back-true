import { EntityManager } from 'typeorm';
import { createRecord } from 'services/record/record-service';
import { OperationType, Operation } from '../../entities/Operation';

/**
 * Execute an addition operation
 * @param userId userId
 * @param number1 number to operate
 * @param number2 number2 to operate
 * @param manager db connection
 * @returns
 */
export const addition = async (userId: string, number1: number, number2: number, manager: EntityManager) => {
    const operationRes = number1 + number2;
    const record = await createRecord(userId, OperationType.ADDITION, manager);
    return { operationRes, record };
};

/**
 * Execute a subtraction operation
 * @param userId userId
 * @param number1 number to operate
 * @param number2 number2 to operate
 * @param manager db connection
 * @returns
 */
export const subtraction = async (userId: string, number1: number, number2: number, manager: EntityManager) => {
    const operationRes = number1 - number2;
    const record = await createRecord(userId, OperationType.SUBTRACTION, manager);
    return { operationRes, record };
};

/**
 * Execute a multiplication operation
 * @param userId userId
 * @param number1 number to operate
 * @param number2 number2 to operate
 * @param manager db connection
 * @returns
 */
export const multiplication = async (userId: string, number1: number, number2: number, manager: EntityManager) => {
    const operationRes = number1 * number2;
    const record = await createRecord(userId, OperationType.MULTIPLICATION, manager);
    return { operationRes, record };
};

/**
 * Execute a division operation
 * @param userId userId
 * @param number1 number to operate
 * @param number2 number2 to operate
 * @param manager db connection
 * @returns
 */
export const division = async (userId: string, number1: number, number2: number, manager: EntityManager) => {
    const operationRes = number1 / number2;
    const record = await createRecord(userId, OperationType.DIVISION, manager);
    return { operationRes, record };
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
    return { operationRes, record };
};

/**
 * Get operations
 * @param manager Db connection
 */
export const getOperations = async (manager: EntityManager) => {
    const operations = await manager.find(Operation);
    return operations.map( o => ({ type: o.type, cost: o.cost }));
};

