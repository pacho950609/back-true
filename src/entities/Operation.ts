import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm';
import { Record } from './Record';

export enum OperationType {
    ADDITION = 'addition',
    SUBTRACTION = 'subtraction',
    MULTIPLICATION = 'multiplication',
    DIVISION = 'division',
    SQUARE_ROOT = 'squareRoot',
    RANDOM_STRING = 'randomString',
}

/**
 * Operation db entity
 */
@Entity()
export class Operation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ type: 'enum', enum: OperationType, unique: true })
    type: OperationType;

    @Column()
    cost: number;

    @OneToMany((type) => Record, (record) => record.operation)
    records: Record[];
}
