import {
  Injectable,
  OnModuleInit,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  Mission,
  MissionType,
  MissionRequirementType,
} from './entities/mission.entity';
import { UserMission } from './entities/user-mission.entity';
import { User } from '../users/entities/user.entity';
import { EventsService } from '../events/events.service';

@Injectable()
export class MissionsService implements OnModuleInit {
  private readonly logger = new Logger(MissionsService.name);

  constructor(
    @InjectRepository(Mission)
    private missionsRepository: Repository<Mission>,
    @InjectRepository(UserMission)
    private userMissionsRepository: Repository<UserMission>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
    private eventsService: EventsService,
  ) {}

  async onModuleInit() {
    await this.seedMissions();
  }

  private async seedMissions() {
    const count = await this.missionsRepository.count();
    if (count === 0) {
      this.logger.log('Seeding missions...');
      const missions = [
        // Daily Missions
        {
          title: 'Kispályás Bűnöző',
          description: 'Kövess el 10 bűntényt.',
          type: MissionType.DAILY,
          requirementType: MissionRequirementType.CRIME,
          requirementValue: 10,
          rewardCash: 500,
          rewardXp: 50,
          rewardDiamonds: 1,
        },
        {
          title: 'Utcai Harcos',
          description: 'Nyerj 3 PvP csatát.',
          type: MissionType.DAILY,
          requirementType: MissionRequirementType.FIGHT_WIN,
          requirementValue: 3,
          rewardCash: 1000,
          rewardXp: 100,
          rewardDiamonds: 2,
        },
        {
          title: 'Gyúrós',
          description: 'Használd a konditermet 5-ször.',
          type: MissionType.DAILY,
          requirementType: MissionRequirementType.GYM_TRAIN,
          requirementValue: 5,
          rewardCash: 300,
          rewardXp: 30,
          rewardDiamonds: 1,
        },
        // Story Missions
        {
          title: 'Kezdetek',
          description: 'Érd el a 2. szintet.',
          type: MissionType.STORY,
          requirementType: MissionRequirementType.LEVEL_UP,
          requirementValue: 2,
          rewardCash: 2000,
          rewardXp: 200,
          rewardDiamonds: 5,
        },
        {
          title: 'Első vér',
          description: 'Nyerj 1 PvP csatát.',
          type: MissionType.STORY,
          requirementType: MissionRequirementType.FIGHT_WIN,
          requirementValue: 1,
          rewardCash: 1500,
          rewardXp: 150,
          rewardDiamonds: 3,
        },
      ];
      await this.missionsRepository.save(missions);
      this.logger.log('Missions seeded successfully.');
    }
  }

  async getMissions(userId: string) {
    // Ensure user has UserMission entries for all available missions
    await this.ensureUserMissions(userId);

    return this.userMissionsRepository.find({
      where: { userId },
      relations: ['mission'],
      order: {
        isClaimed: 'ASC',
        isCompleted: 'DESC',
        mission: { type: 'ASC' },
      },
    });
  }

  private async ensureUserMissions(userId: string) {
    const missions = await this.missionsRepository.find();
    const userMissions = await this.userMissionsRepository.find({
      where: { userId },
    });

    const existingMissionIds = userMissions.map((um) => um.missionId);
    const missingMissions = missions.filter(
      (m) => !existingMissionIds.includes(m.id),
    );

    if (missingMissions.length > 0) {
      const newUserMissions = missingMissions.map((mission) => ({
        userId,
        missionId: mission.id,
        progress: 0,
        isCompleted: false,
        isClaimed: false,
      }));
      await this.userMissionsRepository.save(newUserMissions);
    }
  }

  async trackProgress(
    userId: string,
    type: MissionRequirementType,
    amount: number = 1,
  ) {
    await this.ensureUserMissions(userId);

    const userMissions = await this.userMissionsRepository.find({
      where: {
        userId,
        isCompleted: false,
        mission: { requirementType: type },
      },
      relations: ['mission'],
    });

    for (const um of userMissions) {
      // Check if mission is level up type, handle differently (value is the level itself)
      if (type === MissionRequirementType.LEVEL_UP) {
        if (amount >= um.mission.requirementValue) {
          um.progress = um.mission.requirementValue;
          um.isCompleted = true;
          this.eventsService.broadcastToUser(userId, 'notification', {
            message: `Küldetés teljesítve: ${um.mission.title}`,
          });
        }
      } else {
        // Accumulate progress
        um.progress += amount;
        if (um.progress >= um.mission.requirementValue) {
          um.progress = um.mission.requirementValue;
          um.isCompleted = true;
          this.eventsService.broadcastToUser(userId, 'notification', {
            message: `Küldetés teljesítve: ${um.mission.title}`,
          });
        }
      }
      await this.userMissionsRepository.save(um);
    }
  }

  async claimReward(userId: string, userMissionId: number) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      const userMission = await entityManager.findOne(UserMission, {
        where: { id: userMissionId, userId },
        relations: ['mission'],
      });

      if (!userMission) throw new BadRequestException('Mission not found');
      if (!userMission.isCompleted)
        throw new BadRequestException('Mission not completed yet');
      if (userMission.isClaimed)
        throw new BadRequestException('Reward already claimed');

      const user = await entityManager.findOne(User, { where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');

      // Grant rewards
      const currentCash = BigInt(user.cash);
      const newCash = currentCash + BigInt(userMission.mission.rewardCash);
      user.cash = newCash.toString();

      user.xp += userMission.mission.rewardXp;
      // Note: Diamonds not implemented on User entity yet, skipping for now or adding as placeholder

      userMission.isClaimed = true;

      await entityManager.save(user);
      await entityManager.save(userMission);

      return {
        success: true,
        message: `Jutalom felvéve: $${userMission.mission.rewardCash}, ${userMission.mission.rewardXp} XP`,
        user: {
          cash: user.cash,
          xp: user.xp,
        },
      };
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyReset() {
    this.logger.log('Resetting daily missions...');

    const dailyMissions = await this.missionsRepository.find({
      where: { type: MissionType.DAILY },
    });
    const dailyMissionIds = dailyMissions.map((m) => m.id);

    if (dailyMissionIds.length > 0) {
      await this.userMissionsRepository
        .createQueryBuilder()
        .update(UserMission)
        .set({ progress: 0, isCompleted: false, isClaimed: false })
        .where('missionId IN (:...ids)', { ids: dailyMissionIds })
        .execute();
    }

    this.logger.log('Daily missions reset complete.');
  }
}
