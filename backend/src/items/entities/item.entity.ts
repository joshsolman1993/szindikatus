import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum ItemType {
  WEAPON = 'WEAPON',
  ARMOR = 'ARMOR',
  VEHICLE = 'VEHICLE',
}

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ItemType,
  })
  type: ItemType;

  @Column({ type: 'int' })
  cost: number;

  @Column({ type: 'int', default: 0 })
  bonusStr: number;

  @Column({ type: 'int', default: 0 })
  bonusDef: number;

  @Column({ type: 'int', default: 0 })
  bonusSpd: number;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;
}
