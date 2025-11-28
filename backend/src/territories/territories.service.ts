import {
  Injectable,
  OnModuleInit,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { District } from './entities/district.entity';
import { Clan } from '../clans/entities/clan.entity';
import { User } from '../users/entities/user.entity';
import { EventsService } from '../events/events.service';

@Injectable()
export class TerritoriesService implements OnModuleInit {
  private readonly logger = new Logger(TerritoriesService.name);

  constructor(
    @InjectRepository(District)
    private districtsRepository: Repository<District>,
    @InjectRepository(Clan)
    private clansRepository: Repository<Clan>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
    private eventsService: EventsService,
  ) {}

  async onModuleInit() {
    await this.seedDistricts();
  }

  private async seedDistricts() {
    const count = await this.districtsRepository.count();
    if (count === 0) {
      this.logger.log('Seeding districts...');
      const districts = [
        {
          name: 'Kikötő',
          description:
            'A csempészek paradicsoma. Könnyű célpont, de a bevétel is szerény.',
          defense: 500,
          maxDefense: 500,
          taxRate: 0.03,
          image: '/images/districts/port.jpg',
        },
        {
          name: 'Ipari Zóna',
          description:
            'Gyárak és raktárak. A munkások kemények, de a pénz biztos.',
          defense: 1000,
          maxDefense: 1000,
          taxRate: 0.05,
          image: '/images/districts/industrial.jpg',
        },
        {
          name: 'Vöröslámpás Negyed',
          description: 'A bűn melegágya. Nagy forgalom, nagy bevétel.',
          defense: 1500,
          maxDefense: 1500,
          taxRate: 0.08,
          image: '/images/districts/redlight.jpg',
        },
        {
          name: 'Belváros',
          description: 'Üzletek és irodák. Itt már komoly pénzek forognak.',
          defense: 2500,
          maxDefense: 2500,
          taxRate: 0.1,
          image: '/images/districts/downtown.jpg',
        },
        {
          name: 'Pénzügyi Központ',
          description:
            'Bankok és tőzsde. Csak a legerősebbek merészkednek ide.',
          defense: 4000,
          maxDefense: 4000,
          taxRate: 0.15,
          image: '/images/districts/financial.jpg',
        },
        {
          name: 'Fellegvár',
          description: 'A város elitjének otthona. A végső cél.',
          defense: 8000,
          maxDefense: 8000,
          taxRate: 0.2,
          image: '/images/districts/citadel.jpg',
        },
      ];
      await this.districtsRepository.save(districts);
      this.logger.log('Districts seeded successfully.');
    }
  }

  async getMap() {
    return this.districtsRepository.find({
      relations: ['ownerClan'],
      order: { defense: 'ASC' }, // Sort by difficulty roughly
    });
  }

  async attackDistrict(userId: string, districtId: number) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      const user = await entityManager.findOne(User, {
        where: { id: userId },
        relations: ['clan'],
      });
      const district = await entityManager.findOne(District, {
        where: { id: districtId },
        relations: ['ownerClan'],
      });

      if (!user) throw new NotFoundException('User not found');
      if (!district) throw new NotFoundException('District not found');
      if (!user.clan)
        throw new BadRequestException(
          'You must be in a clan to attack territories.',
        );

      const isOwnDistrict = district.ownerClanId === user.clan.id;
      const action = isOwnDistrict ? 'reinforce' : 'attack';

      // Cost: 5 Nerve, 10 Energy
      const nerveCost = 5;
      const energyCost = 10;

      if (user.nerve < nerveCost || user.energy < energyCost) {
        throw new BadRequestException('Not enough nerve or energy.');
      }

      user.nerve -= nerveCost;
      user.energy -= energyCost;

      let message = '';
      let damage = 0;

      if (action === 'attack') {
        // Damage calculation based on user stats (e.g., Strength + Weapon)
        // Simplified: Strength * 2 + Random(10-20)
        damage = Math.floor(user.stats.str * 2 + Math.random() * 10 + 10);
        district.defense -= damage;

        if (district.defense <= 0) {
          // Capture!
          const oldOwnerName = district.ownerClan
            ? district.ownerClan.name
            : 'Senki';
          district.ownerClan = user.clan;
          district.defense = Math.floor(district.maxDefense * 0.5); // Reset to 50%

          message = `ELFOGLALTAD a(z) ${district.name} kerületet!`;

          // Broadcast event
          this.eventsService.emitToAll('announcement', {
            message: `HÍR: A(z) ${user.clan.name} klán elfoglalta a(z) ${district.name} kerületet tőle: ${oldOwnerName}!`,
            type: 'territory_capture',
          });
        } else {
          message = `Sikeres támadás! ${damage} sebzést okoztál a védelemnek.`;
        }
      } else {
        // Reinforce
        const repairAmount = Math.floor(
          user.stats.str * 2 + Math.random() * 10 + 10,
        );
        district.defense = Math.min(
          district.maxDefense,
          district.defense + repairAmount,
        );
        message = `Megerősítetted a kerület védelmét ${repairAmount} ponttal.`;
      }

      await entityManager.save(user);
      await entityManager.save(district);

      return {
        success: true,
        message,
        district: {
          id: district.id,
          defense: district.defense,
          ownerClan: district.ownerClan
            ? {
                id: district.ownerClan.id,
                name: district.ownerClan.name,
                tag: district.ownerClan.tag,
              }
            : null,
        },
        user: {
          nerve: user.nerve,
          energy: user.energy,
        },
      };
    });
  }
}
