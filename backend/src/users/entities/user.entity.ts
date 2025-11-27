import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { GameBalance } from '../../config/game-balance.config';
import { Clan } from '../../clans/entities/clan.entity';

export enum ClanRank {
    LEADER = 'LEADER',
    MEMBER = 'MEMBER',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password_hash: string;

    // BigInt-et stringként kezeljük JS oldalon a pontosság miatt
    @Index()
    @Column({ type: 'bigint', default: GameBalance.INITIAL_CASH })
    cash: string;

    @Column({ type: 'int', default: GameBalance.INITIAL_ENERGY })
    energy: number;

    @Column({ type: 'int', default: GameBalance.INITIAL_NERVE })
    nerve: number;

    @Column({ type: 'int', default: GameBalance.INITIAL_HP })
    hp: number;

    @Index()
    @Column({ type: 'int', default: 0 })
    xp: number;

    @Column({ type: 'int', default: 1 })
    level: number;

    @Column({ type: 'int', default: 0 })
    talentPoints: number;

    @Column({ type: 'jsonb', default: [] })
    learnedTalents: string[];

    @Column({ type: 'jsonb', default: GameBalance.INITIAL_STATS })
    stats: {
        str: number;
        tol: number;
        int: number;
        spd: number;
    };

    @Index()
    @Column({ nullable: true })
    clanId: string | null;

    @Column({
        type: 'enum',
        enum: ClanRank,
        nullable: true,
    })
    clanRank: ClanRank | null;

    @ManyToOne(() => Clan, (clan) => clan.members)
    @JoinColumn({ name: 'clanId' })
    clan: Clan;

    @Column({ type: 'text', nullable: true })
    bio: string | null;

    @Column({ type: 'jsonb', default: { soundEnabled: true } })
    settings: {
        soundEnabled: boolean;
    };

    @Column({ nullable: true })
    avatarUrl: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
