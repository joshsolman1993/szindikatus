import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { GameBalance } from '../../config/game-balance.config';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password_hash: string;

    // BigInt-et stringként kezeljük JS oldalon a pontosság miatt
    @Column({ type: 'bigint', default: GameBalance.INITIAL_CASH })
    cash: string;

    @Column({ type: 'int', default: GameBalance.INITIAL_ENERGY })
    energy: number;

    @Column({ type: 'int', default: GameBalance.INITIAL_NERVE })
    nerve: number;

    @Column({ type: 'int', default: GameBalance.INITIAL_HP })
    hp: number;

    @Column({ type: 'jsonb', default: GameBalance.INITIAL_STATS })
    stats: {
        str: number;
        tol: number;
        int: number;
        spd: number;
    };

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
