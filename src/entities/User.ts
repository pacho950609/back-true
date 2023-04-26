import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm';
import { Record } from './Record';

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

/**
 * User db entity
 */
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @OneToMany((type) => Record, (record) => record.user)
    records: Record[];
}
