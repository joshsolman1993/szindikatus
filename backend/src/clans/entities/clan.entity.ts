import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('clans')
export class Clan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ length: 4 })
    tag: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    leaderId: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'leaderId' })
    leader: User;

    @OneToMany(() => User, (user) => user.clan)
    members: User[];

    @CreateDateColumn()
    createdAt: Date;
}
