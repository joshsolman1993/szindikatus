import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Clan } from './clan.entity';

export enum ClanUpgradeType {
    FORTRESS = 'FORTRESS',
    TRAINING_GROUND = 'TRAINING_GROUND',
    BLACK_MARKET_CONN = 'BLACK_MARKET_CONN',
}

@Entity('clan_upgrades')
@Index(['clanId', 'type'], { unique: true }) // Egy klánnak csak egy upgrade típusa lehet
export class ClanUpgrade {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    clanId: string;

    @ManyToOne(() => Clan)
    @JoinColumn({ name: 'clanId' })
    clan: Clan;

    @Column({
        type: 'enum',
        enum: ClanUpgradeType,
    })
    type: ClanUpgradeType;

    @Column({ type: 'int', default: 0 })
    level: number;
}
