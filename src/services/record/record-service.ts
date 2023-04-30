import { EntityManager } from 'typeorm';
import { OperationType, Operation } from 'entities/Operation';
import { StatusCodeError } from 'utils/error';
import { Record, OperationResponse } from '../../entities/Record';

/**
 * Create a new record using a transaction to prevent dirty reads
 * @param userId User id
 * @param type Type id
 * @param tManager Db connection
 */
export const createRecord = async (userId: string, type: OperationType, manager: EntityManager) => {
    let record: Record;

    await manager.transaction(async (tManager) => {
        const operationEntity = await tManager.findOne(Operation, { where: { type } });
        const lastRecord = await tManager
            .createQueryBuilder(Record, 'r')
            .innerJoin(
                (sq) => {
                    return sq
                        .select(['user_id', 'max(date) last_date'])
                        .from(Record, 'r2')
                        .where('user_id = :userId', { userId })
                        .groupBy('user_id');
                },
                'last_date_query',
                'last_date_query.user_id = r.user_id and last_date_query.last_date = r.date',
            )
            .getOne();

        const partialRecord = {
            operationId: operationEntity.id,
            userId,
            amount: operationEntity.cost,
        };

        if (lastRecord && lastRecord.userBalance >= operationEntity.cost) {
            // Enough balance case
            record = new Record({
                ...partialRecord,
                userBalance: lastRecord.userBalance - operationEntity.cost,
                operationResponse: OperationResponse.OK,
            });
        } else if (lastRecord) {
            // Not Enough balance case
            record = new Record({
                ...partialRecord,
                userBalance: lastRecord.userBalance,
                operationResponse: OperationResponse.ERROR,
            });
        } else {
            // First enough balance case
            record = new Record({
                ...partialRecord,
                userBalance: 10000 - operationEntity.cost,
                operationResponse: OperationResponse.OK,
            });
        }
        await tManager.save(record);
    });

    if (record.operationResponse === OperationResponse.ERROR) {
        throw new StatusCodeError('Not Enough balance', 400);
    }

    return record;
};

/**
 * Delete a user record
 * @param userId  User id
 * @param recordId  Record id
 * @param manager  Db connection
 */
export const deleteRecord = async (userId: string, recordId: string, manager: EntityManager) => {
    const record = await manager.findOne(Record, { where: { id: recordId, userId, deleted: false } });
    if (!record) {
        throw new StatusCodeError(`Doesn't exist a user record with id ${recordId}`);
    }
    await manager.update(Record, { id: recordId }, { deleted: true });
};

/**
 * Records filter interface
 */
export interface RecordFilters {
    page: number;
    recordsPerPage: number;
    operationResponse?: OperationResponse;
    type?: OperationType;
    date?: string;
    orderBy?: {
        type: 'ASC' | 'DESC';
        column: 'date' | 'type' | 'operationResponse';
    };
}

/**
 * Get user records
 * @param userId  User id
 * @param filters Filter that you want to apply in the records result
 * @param manager Db connection
 */
export const getUserRecords = async (userId: string, filters: RecordFilters, manager: EntityManager) => {
    const { page, recordsPerPage, operationResponse, type, date, orderBy } = filters;

    const query = manager
        .createQueryBuilder(Record, 'r')
        .leftJoinAndSelect('r.operation', 'o')
        .where('r.user_id = :userId and r.deleted = false', { userId });

    if (operationResponse) {
        query.andWhere('r.operationResponse = :operationResponse', { operationResponse });
    }

    if (type) {
        query.andWhere('o.type = :type', { type });
    }

    if (date) {
        query.andWhere('Date(r.date) = :date', { date }).orderBy('date', 'DESC');
    }

    query.limit(recordsPerPage);
    query.offset(recordsPerPage * (page - 1));

    if (orderBy?.column) {
        query.orderBy(
            orderBy.column === 'operationResponse' ? 'operation_response' : orderBy.column,
            orderBy.type ?? 'ASC',
        );
    }

    const records = await query.getMany();

    return records.map((r) => ({
        id: r.id,
        type: r.operation.type,
        userBalance: r.userBalance,
        operationResponse: r.operationResponse,
        amount: r.amount,
        date: r.date,
    }));
};

/**
 * Get query number of pages and return first query page
 * @param userId  User id
 * @param filters Filter that you want to apply in the records result
 * @param manager Db connection
 */
export const getQueryNumberOfPages = async (
    userId: string,
    filters: Omit<RecordFilters, 'page'>,
    manager: EntityManager,
) => {
    const { recordsPerPage, operationResponse, type, date } = filters;

    const query = manager
        .createQueryBuilder(Record, 'r')
        .leftJoinAndSelect('r.operation', 'o')
        .where('r.user_id = :userId and r.deleted = false', { userId });

    if (operationResponse) {
        query.andWhere('r.operationResponse = :operationResponse', { operationResponse });
    }

    if (type) {
        query.andWhere('o.type = :type', { type });
    }

    if (date) {
        query.andWhere('Date(r.date) = :date', { date }).orderBy('date', 'DESC');
    }

    const count = await query.getCount();
    const records = await getUserRecords(userId, { ...filters, page: 1 }, manager);
    const pages = Math.ceil(count / recordsPerPage);

    return {
        pages: pages > 0 ? pages : 1,
        records,
    };
};

/**
 * Get user balance
 * @param userId User id
 * @param manager Db connection
 */
export const getBalance = async (userId: string, manager: EntityManager) => {
    const lastRecord = await manager
    .createQueryBuilder(Record, 'r')
    .innerJoin(
        (sq) => {
            return sq
                .select(['user_id', 'max(date) last_date'])
                .from(Record, 'r2')
                .where('user_id = :userId', { userId })
                .groupBy('user_id');
        },
        'last_date_query',
        'last_date_query.user_id = r.user_id and last_date_query.last_date = r.date',
    )
    .getOne();

    return lastRecord?.userBalance ?? 10000;
};