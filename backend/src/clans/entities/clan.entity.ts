import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { District } from '../../territories/entities/district.entity';

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

  @Index()
  @Column()
  leaderId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'leaderId' })
  leader: User;

  @OneToMany(() => User, (user) => user.clan)
  members: User[];

  @OneToMany(() => District, (district) => district.ownerClan)
  districts: District[];

  @Column({ type: 'bigint', default: 0 })
  bank: string;

  @CreateDateColumn()
  createdAt: Date;
}
