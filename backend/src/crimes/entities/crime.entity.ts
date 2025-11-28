import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { District } from '../../territories/entities/district.entity';

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

  @Column({ nullable: true })
  districtId: number;

  @ManyToOne(() => District, { nullable: true })
  @JoinColumn({ name: 'districtId' })
  district: District;
}
