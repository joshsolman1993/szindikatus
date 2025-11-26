import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Property } from './property.entity';

@Entity('user_properties')
export class UserProperty {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    propertyId: number;

    @Column({ type: 'int', default: 1 })
    level: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastCollectedAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Property)
    @JoinColumn({ name: 'propertyId' })
    property: Property;
}
