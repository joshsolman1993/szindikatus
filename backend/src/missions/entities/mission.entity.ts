import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum MissionType {
  DAILY = 'DAILY',
  STORY = 'STORY',
}

export enum MissionRequirementType {
  CRIME = 'CRIME',
  FIGHT_WIN = 'FIGHT_WIN',
  GYM_TRAIN = 'GYM_TRAIN',
  LEVEL_UP = 'LEVEL_UP',
}

@Entity('missions')
export class Mission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: MissionType,
  })
  type: MissionType;

  @Column({
    type: 'enum',
    enum: MissionRequirementType,
  })
  requirementType: MissionRequirementType;

  @Column({ type: 'int' })
  requirementValue: number;

  @Column({ type: 'int', default: 0 })
  rewardCash: number;

  @Column({ type: 'int', default: 0 })
  rewardXp: number;

  @Column({ type: 'int', default: 0 })
  rewardDiamonds: number;
}
