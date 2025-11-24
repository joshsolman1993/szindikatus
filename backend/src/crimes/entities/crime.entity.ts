import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('crimes')
export class Crime {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: 'int' })
    energyCost: number;

    @Column({ type: 'int' })
    difficulty: number;

    @Column({ type: 'int' })
    minMoney: number;

    @Column({ type: 'int' })
    maxMoney: number;

    @Column({ type: 'int' })
    xpReward: number;
}
