import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int' })
  cost: number;

  @Column({ type: 'int' })
  incomePerHour: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  imageUrl: string;
}
