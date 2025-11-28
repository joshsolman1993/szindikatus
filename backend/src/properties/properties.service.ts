import {
  Injectable,
  OnModuleInit,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Property } from './entities/property.entity';
import { UserProperty } from './entities/user-property.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PropertiesService implements OnModuleInit {
  private readonly logger = new Logger(PropertiesService.name);

  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
    @InjectRepository(UserProperty)
    private userPropertiesRepository: Repository<UserProperty>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.seedProperties();
  }

  private async seedProperties() {
    const count = await this.propertiesRepository.count();
    if (count === 0) {
      this.logger.log('Seeding properties...');
      const properties = [
        {
          name: 'Putri a 8. kerületben',
          description: 'Nem egy Hilton, de a tiéd. Kiváló búvóhely.',
          cost: 2000,
          incomePerHour: 50,
          imageUrl:
            'https://images.unsplash.com/photo-1605218427306-6354db69e563?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Illegális Szeszfőzde',
          description: 'A legjobb házi pálinka a városban. Dől a lé.',
          cost: 15000,
          incomePerHour: 500,
          imageUrl:
            'https://images.unsplash.com/photo-1516937941348-c09645f8b434?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Éjszakai Klub',
          description:
            'Ahol az alvilág krémje mulat. Magas bevétel, magas kockázat.',
          cost: 150000,
          incomePerHour: 4000,
          imageUrl:
            'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Fegyvergyár',
          description: 'Háború van? Akkor mi gazdagszunk. Az igazi hatalom.',
          cost: 2000000,
          incomePerHour: 50000,
          imageUrl:
            'https://images.unsplash.com/photo-1580234550905-408d43d48d01?w=500&auto=format&fit=crop&q=60',
        },
      ];
      await this.propertiesRepository.save(properties);
      this.logger.log('Properties seeded successfully.');
    }
  }

  async findAll() {
    return this.propertiesRepository.find({ order: { cost: 'ASC' } });
  }

  async findMyProperties(userId: string) {
    return this.userPropertiesRepository.find({
      where: { userId },
      relations: ['property'],
      order: { property: { cost: 'ASC' } },
    });
  }

  async buyProperty(userId: string, propertyId: number) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      const user = await entityManager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });
      const property = await entityManager.findOne(Property, {
        where: { id: propertyId },
      });

      if (!user || !property) {
        throw new BadRequestException(
          'Felhasználó vagy ingatlan nem található.',
        );
      }

      // Check if already owned (limit 1 per type)
      const existing = await entityManager.findOne(UserProperty, {
        where: { userId, propertyId },
      });

      if (existing) {
        throw new BadRequestException('Már rendelkezel ilyen ingatlannal!');
      }

      const currentCash = BigInt(user.cash);
      const cost = BigInt(property.cost);

      if (currentCash < cost) {
        throw new BadRequestException(
          'Nincs elég pénzed az ingatlan megvásárlásához.',
        );
      }

      // Deduct cash
      user.cash = (currentCash - cost).toString();
      await entityManager.save(user);

      // Create UserProperty
      const userProperty = new UserProperty();
      userProperty.userId = userId;
      userProperty.propertyId = propertyId;
      userProperty.lastCollectedAt = new Date(); // Start collecting from now

      await entityManager.save(UserProperty, userProperty);

      return { message: 'Sikeres vásárlás!', propertyName: property.name };
    });
  }

  async collectIncome(userId: string) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      const userProperties = await entityManager.find(UserProperty, {
        where: { userId },
        relations: ['property'],
      });

      if (userProperties.length === 0) {
        return { collectedAmount: 0, message: 'Nincs bevételed.' };
      }

      let totalIncome = 0;
      const now = new Date();

      for (const up of userProperties) {
        const lastCollected = new Date(up.lastCollectedAt);
        const diffMs = now.getTime() - lastCollected.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        // Cap at 24 hours
        const hoursToCollect = Math.min(diffHours, 24);

        if (hoursToCollect > 0) {
          const income = Math.floor(hoursToCollect * up.property.incomePerHour);
          totalIncome += income;

          // Reset timer
          up.lastCollectedAt = now;
          await entityManager.save(UserProperty, up);
        }
      }

      if (totalIncome > 0) {
        const user = await entityManager.findOne(User, {
          where: { id: userId },
          lock: { mode: 'pessimistic_write' },
        });
        if (user) {
          const currentCash = BigInt(user.cash);
          user.cash = (currentCash + BigInt(totalIncome)).toString();
          await entityManager.save(User, user);
        }
      }

      return {
        collectedAmount: totalIncome,
        message:
          totalIncome > 0
            ? `Sikeresen begyűjtöttél $${totalIncome}-t!`
            : 'Még nem gyűlt össze elég bevétel.',
      };
    });
  }
}
