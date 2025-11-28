import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Item } from './item.entity';

export enum ItemRarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  itemId: string;

  @Column({ type: 'boolean', default: false })
  isEquipped: boolean;

  @Column({ type: 'boolean', default: false })
  isListed: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column({
    type: 'enum',
    enum: ItemRarity,
    default: ItemRarity.COMMON,
  })
  rarity: ItemRarity;

  @Column({ type: 'float', default: 1.0 })
  quality: number;

  @CreateDateColumn()
  createdAt: Date;
}
