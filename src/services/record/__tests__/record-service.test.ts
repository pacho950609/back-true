import { Database } from 'db/Database';
import { Connection } from 'typeorm';
import { Record, OperationResponse } from 'entities/Record';
import { User } from 'entities/User';
import { hash } from 'utils/encryption';
import { Operation, OperationType } from 'entities/Operation';
import { getQueryNumberOfPages, getUserRecords, deleteRecord } from '../record-service';

const database = new Database();
let connection: Connection;

beforeAll(async () => {
    connection = await database.getConnection();
});

afterAll(async () => {
    await connection.close();
});

describe('Get records', () => {
    let user: User;
    beforeAll(async () => {
        await Database.resetConnection(connection);
        const { manager } = connection;
        user = new User();
        user.email = 'test1@yopmail.com';
        user.password = await hash('test1');
        user = await manager.save(user);

        const user2 = new User();
        user2.email = 'test2@yopmail.com';
        user2.password = await hash('test2');
        await manager.save(user2);

        const operationA = new Operation();
        operationA.type = OperationType.ADDITION;
        operationA.cost = 100;
        await manager.save(operationA);

        const operationS = new Operation();
        operationS.type = OperationType.SUBTRACTION;
        operationS.cost = 50;
        await manager.save(operationS);

        await manager.save(
            new Record({
                amount: 100,
                operationId: operationA.id,
                userId: user2.id,
                operationResponse: OperationResponse.OK,
                userBalance: 250,
            }),
        );

        await manager.save(
            new Record({
                amount: 100,
                operationId: operationA.id,
                userId: user.id,
                operationResponse: OperationResponse.OK,
                userBalance: 250,
            }),
        );

        await manager.save(
            new Record({
                amount: 50,
                operationId: operationS.id,
                userId: user.id,
                operationResponse: OperationResponse.OK,
                userBalance: 200,
            }),
        );

        await manager.save(
            new Record({
                amount: 50,
                operationId: operationS.id,
                userId: user.id,
                operationResponse: OperationResponse.OK,
                userBalance: 150,
            }),
        );

        await manager.save(
            new Record({
                amount: 100,
                operationId: operationA.id,
                userId: user.id,
                operationResponse: OperationResponse.OK,
                userBalance: 50,
            }),
        );

        await manager.save(
            new Record({
                amount: 100,
                operationId: operationA.id,
                userId: user.id,
                operationResponse: OperationResponse.ERROR,
                userBalance: 50,
            }),
        );
    });

    test('Get user records with page number', async () => {
        const { manager } = connection;
        const res = await getQueryNumberOfPages(
            user.id,
            { recordsPerPage: 2, orderBy: { column: 'date', type: 'DESC' } },
            manager,
        );
        expect(res.pages).toBe(3);
        expect(res.records.length).toBe(2);

        expect(res.records[0].userBalance).toBe(50);
        expect(res.records[0].type).toBe(OperationType.ADDITION);
        expect(res.records[0].amount).toBe(100);
        expect(res.records[0].operationResponse).toBe(OperationResponse.ERROR);

        expect(res.records[1].userBalance).toBe(50);
        expect(res.records[1].type).toBe(OperationType.ADDITION);
        expect(res.records[1].amount).toBe(100);
        expect(res.records[1].operationResponse).toBe(OperationResponse.OK);
    });

    test('Get user records ordering', async () => {
        const { manager } = connection;
        const page2 = await getUserRecords(
            user.id,
            { page: 2, recordsPerPage: 2, orderBy: { column: 'date', type: 'DESC' } },
            manager,
        );
        const page3 = await getUserRecords(
            user.id,
            { page: 3, recordsPerPage: 2, orderBy: { column: 'date', type: 'DESC' } },
            manager,
        );

        expect(page2.length).toBe(2);

        expect(page2[0].userBalance).toBe(150);
        expect(page2[0].type).toBe(OperationType.SUBTRACTION);
        expect(page2[0].amount).toBe(50);
        expect(page2[0].operationResponse).toBe(OperationResponse.OK);

        expect(page2[1].userBalance).toBe(200);
        expect(page2[1].type).toBe(OperationType.SUBTRACTION);
        expect(page2[1].amount).toBe(50);
        expect(page2[1].operationResponse).toBe(OperationResponse.OK);

        expect(page3.length).toBe(1);

        expect(page3[0].userBalance).toBe(250);
        expect(page3[0].type).toBe(OperationType.ADDITION);
        expect(page3[0].amount).toBe(100);
        expect(page3[0].operationResponse).toBe(OperationResponse.OK);
    });

    test('Get user records filtering', async () => {
        const { manager } = connection;
        const additionRecords = await getQueryNumberOfPages(
            user.id,
            { recordsPerPage: 2, type: OperationType.ADDITION },
            manager,
        );

        expect(additionRecords.records.length).toBe(2);
        expect(additionRecords.pages).toBe(2);

        expect(additionRecords.records[0].userBalance).toBe(250);
        expect(additionRecords.records[0].type).toBe(OperationType.ADDITION);
        expect(additionRecords.records[0].amount).toBe(100);
        expect(additionRecords.records[0].operationResponse).toBe(OperationResponse.OK);

        expect(additionRecords.records[1].userBalance).toBe(50);
        expect(additionRecords.records[1].type).toBe(OperationType.ADDITION);
        expect(additionRecords.records[1].amount).toBe(100);
        expect(additionRecords.records[1].operationResponse).toBe(OperationResponse.OK);

        const additionRecordsPage2 = await getUserRecords(
            user.id,
            { page: 2, recordsPerPage: 2, type: OperationType.ADDITION },
            manager,
        );

        expect(additionRecordsPage2.length).toBe(1);
        expect(additionRecordsPage2[0].userBalance).toBe(50);
        expect(additionRecordsPage2[0].type).toBe(OperationType.ADDITION);
        expect(additionRecordsPage2[0].amount).toBe(100);
        expect(additionRecordsPage2[0].operationResponse).toBe(OperationResponse.ERROR);
    });
});

describe('Delete records', () => {
    let user: User;
    let record: Record;
    let record2: Record;
    beforeAll(async () => {
        await Database.resetConnection(connection);
        const { manager } = connection;
        user = new User();
        user.email = 'test1@yopmail.com';
        user.password = await hash('test1');
        user = await manager.save(user);

        const user2 = new User();
        user2.email = 'test2@yopmail.com';
        user2.password = await hash('test2');
        await manager.save(user2);

        const operationA = new Operation();
        operationA.type = OperationType.ADDITION;
        operationA.cost = 100;
        await manager.save(operationA);

        record2 = await manager.save(
            new Record({
                amount: 100,
                operationId: operationA.id,
                userId: user2.id,
                operationResponse: OperationResponse.OK,
                userBalance: 250,
            }),
        );

        record = await manager.save(
            new Record({
                amount: 50,
                operationId: operationA.id,
                userId: user.id,
                operationResponse: OperationResponse.OK,
                userBalance: 200,
            }),
        );
    });

    test('Delete user record', async () => {
        const { manager } = connection;
        await deleteRecord(user.id, record.id, manager);

        const userRecord = await manager.findOne(Record, record.id);
        expect(userRecord.deleted).toBe(true);
    });

    test('Delete another user record', async () => {
        const { manager } = connection;
        await expect(deleteRecord(user.id, record2.id, manager)).rejects.toThrow();
    });
});
