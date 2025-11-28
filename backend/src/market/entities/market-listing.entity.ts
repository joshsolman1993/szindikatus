import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Inventory } from '../../items/entities/inventory.entity';

@Entity('market_listings')
export class MarketListing {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'seller_id' })
  sellerId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller!: User;

  @Column({ name: 'inventory_id' })
  inventoryId!: string;

  @ManyToOne(() => Inventory, { eager: true })
  @JoinColumn({ name: 'inventory_id' })
  inventory!: Inventory;

  @Column({ type: 'bigint' })
  price!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;
}
