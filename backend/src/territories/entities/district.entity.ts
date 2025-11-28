import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Clan } from '../../clans/entities/clan.entity';

@Entity('districts')
export class District {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  ownerClanId: string;

  @ManyToOne(() => Clan, (clan) => clan.districts, { nullable: true })
  @JoinColumn({ name: 'ownerClanId' })
  ownerClan: Clan;

  @Column({ type: 'int', default: 1000 })
  defense: number;

  @Column({ type: 'int', default: 1000 })
  maxDefense: number;

  @Column({ type: 'float', default: 0.05 })
  taxRate: number;

  @Column({ nullable: true })
  image: string;
}
