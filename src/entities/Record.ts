import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Operation } from './Operation';

export enum OperationResponse {
    OK = 'OK',
    ERROR = 'ERROR',
}

/**
 * Record db entity
 */
@Entity()
export class Record {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    operationId: string;

    @Column()
    userId: string;

    @Column({ type: 'real' })
    amount: number;

    @Column({ type: 'real' })
    userBalance: number;

    @Column({ type: 'enum', enum: OperationResponse })
    operationResponse: OperationResponse;

    /** Goal  */
    @ManyToOne((type) => User, (user) => user.records)
    user: User;

    /** Goal  */
    @ManyToOne((type) => Operation, (operation) => operation.records)
    operation: Operation;

    @CreateDateColumn()
    date: Date;

    @Column({ default: false })
    deleted: boolean;

    constructor(payload: Omit<Record, 'id' | 'operation' | 'user' | 'date' | 'deleted'>) {
        if (payload) {
            this.operationId = payload.operationId;
            this.userId = payload.userId;
            this.amount = payload.amount;
            this.userBalance = payload.userBalance;
            this.operationResponse = payload.operationResponse;
        }
    }
}
