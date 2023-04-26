import { Database } from 'db/Database';
import { Connection } from 'typeorm';
import Chance from 'chance';
import { Record, OperationResponse } from 'entities/Record';
import { User } from 'entities/User';
import { hash } from 'utils/encryption';
import { Operation, OperationType } from 'entities/Operation';
import { addition, subtraction, multiplication, division } from '../operations-service';

const chance = new Chance();
const database = new Database();
let connection: Connection;

beforeAll(async () => {
    connection = await database.getConnection();
});

afterAll(async () => {
    await connection.close();
});

describe('Addition', () => {
    let user: User;
    let operation: Operation;
    beforeEach(async () => {
        await Database.resetConnection(connection);
        const { manager } = connection;
        user = new User();
        user.email = 'test@yopmail.com';
        user.password = await hash('test');
        await manager.save(user)

        operation = new Operation();
        operation.type = OperationType.ADDITION;
        operation.cost = 100;
        operation = await manager.save(operation)
    });

    test('Enough balance', async () => {
        const { manager } = connection;
        await manager.save(new Record({
            amount: 100,
            operationId: operation.id,
            userId: user.id,
            operationResponse: OperationResponse.OK,
            userBalance: 250
        }));
        const res = await addition(user.id, 1, 2 ,manager);

        expect(res.operationRes).toBe(3);
        expect(res.record.amount).toBe(100);
        expect(res.record.operationId).toBe(operation.id);
        expect(res.record.userBalance).toBe(150);
    });
    test('Not enough balance', async () => {
        const { manager } = connection;
        await manager.save(new Record({
            amount: 100,
            operationId: operation.id,
            userId: user.id,
            operationResponse: OperationResponse.OK,
            userBalance: 50
        }));
        await expect(addition(user.id, 1, 2 ,manager)).rejects.toThrow();
    });
});

describe('Subtraction', () => {
    let user: User;
    let operation: Operation;
    beforeEach(async () => {
        await Database.resetConnection(connection);
        const { manager } = connection;
        user = new User();
        user.email = 'test@yopmail.com';
        user.password = await hash('test');
        await manager.save(user)

        operation = new Operation();
        operation.type = OperationType.SUBTRACTION;
        operation.cost = 100;
        operation = await manager.save(operation)
    });

    test('Enough balance', async () => {
        const { manager } = connection;
        await manager.save(new Record({
            amount: 100,
            operationId: operation.id,
            userId: user.id,
            operationResponse: OperationResponse.OK,
            userBalance: 250
        }));
        const res = await subtraction(user.id, 2, 1,manager);

        expect(res.operationRes).toBe(1);
        expect(res.record.amount).toBe(100);
        expect(res.record.operationId).toBe(operation.id);
        expect(res.record.userBalance).toBe(150);
    });
    test('Not enough balance', async () => {
        const { manager } = connection;
        await manager.save(new Record({
            amount: 100,
            operationId: operation.id,
            userId: user.id,
            operationResponse: OperationResponse.OK,
            userBalance: 50
        }));
        await expect(subtraction(user.id, 1, 2 ,manager)).rejects.toThrow();
    });
});

describe('Multiplication', () => {
    let user: User;
    let operation: Operation;
    beforeEach(async () => {
        await Database.resetConnection(connection);
        const { manager } = connection;
        user = new User();
        user.email = 'test@yopmail.com';
        user.password = await hash('test');
        await manager.save(user)

        operation = new Operation();
        operation.type = OperationType.MULTIPLICATION;
        operation.cost = 100;
        operation = await manager.save(operation)
    });

    test('Enough balance', async () => {
        const { manager } = connection;
        await manager.save(new Record({
            amount: 100,
            operationId: operation.id,
            userId: user.id,
            operationResponse: OperationResponse.OK,
            userBalance: 250
        }));
        const res = await multiplication(user.id, 2, 3,manager);

        expect(res.operationRes).toBe(6);
        expect(res.record.amount).toBe(100);
        expect(res.record.operationId).toBe(operation.id);
        expect(res.record.userBalance).toBe(150);
    });
    test('Not enough balance', async () => {
        const { manager } = connection;
        await manager.save(new Record({
            amount: 100,
            operationId: operation.id,
            userId: user.id,
            operationResponse: OperationResponse.OK,
            userBalance: 50
        }));
        await expect(multiplication(user.id, 1, 2 ,manager)).rejects.toThrow();
    });
});

describe('Division', () => {
    let user: User;
    let operation: Operation;
    beforeEach(async () => {
        await Database.resetConnection(connection);
        const { manager } = connection;
        user = new User();
        user.email = 'test@yopmail.com';
        user.password = await hash('test');
        await manager.save(user)

        operation = new Operation();
        operation.type = OperationType.DIVISION;
        operation.cost = 100;
        operation = await manager.save(operation)
    });

    test('Enough balance', async () => {
        const { manager } = connection;
        await manager.save(new Record({
            amount: 100,
            operationId: operation.id,
            userId: user.id,
            operationResponse: OperationResponse.OK,
            userBalance: 250
        }));
        const res = await division(user.id, 6, 2,manager);

        expect(res.operationRes).toBe(3);
        expect(res.record.amount).toBe(100);
        expect(res.record.operationId).toBe(operation.id);
        expect(res.record.userBalance).toBe(150);
    });
    test('Not enough balance', async () => {
        const { manager } = connection;
        await manager.save(new Record({
            amount: 100,
            operationId: operation.id,
            userId: user.id,
            operationResponse: OperationResponse.OK,
            userBalance: 50
        }));
        await expect(division(user.id, 1, 2 ,manager)).rejects.toThrow();
    });
});