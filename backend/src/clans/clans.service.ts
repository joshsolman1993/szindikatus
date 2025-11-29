import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clan } from './entities/clan.entity';
import { ClanUpgrade, ClanUpgradeType } from './entities/clan-upgrade.entity';
import { User, ClanRank } from '../users/entities/user.entity';
import { GameBalance } from '../config/game-balance.config';
import { CLAN_UPGRADES, calculateUpgradeCost } from './clan-upgrades.constants';

@Injectable()
export class ClansService {
  constructor(
    @InjectRepository(Clan)
    private clansRepository: Repository<Clan>,
    @InjectRepository(ClanUpgrade)
    private clanUpgradesRepository: Repository<ClanUpgrade>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(
    userId: string,
    createClanDto: { name: string; tag: string; description?: string },
  ): Promise<Clan> {
    return await this.clansRepository.manager.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) throw new NotFoundException('Felhasználó nem található.');

      if (user.clanId) {
        throw new ConflictException('Már tagja vagy egy bandának!');
      }

      // Költség ellenőrzés
      const cost = GameBalance.CLAN_CREATION_COST;
      if (parseInt(user.cash) < cost) {
        throw new ConflictException(
          `Nincs elég pénzed a banda alapításához! Szükséges: $${cost}`,
        );
      }

      // Név/Tag egyediség
      const existingName = await manager.findOne(Clan, {
        where: { name: createClanDto.name },
      });
      if (existingName)
        throw new ConflictException('Ez a banda név már foglalt.');

      const existingTag = await manager.findOne(Clan, {
        where: { tag: createClanDto.tag },
      });
      if (existingTag)
        throw new ConflictException('Ez a banda tag már foglalt.');

      // Pénz levonás
      user.cash = (parseInt(user.cash) - cost).toString();

      // Banda létrehozása
      const clan = manager.create(Clan, {
        ...createClanDto,
        leaderId: userId,
      });
      const savedClan = await manager.save(Clan, clan);

      // User update
      user.clanId = savedClan.id;
      user.clanRank = ClanRank.LEADER;
      await manager.save(User, user);

      return savedClan;
    });
  }

  async join(userId: string, clanId: string): Promise<User> {
    return await this.usersRepository.manager.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      const clan = await manager.findOne(Clan, { where: { id: clanId } });

      if (!user || !clan)
        throw new NotFoundException('Felhasználó vagy banda nem található.');

      if (user.clanId) {
        throw new ConflictException('Már tagja vagy egy bandának!');
      }

      user.clanId = clan.id;
      user.clanRank = ClanRank.MEMBER;

      return await manager.save(User, user);
    });
  }

  async leave(userId: string): Promise<{ message: string }> {
    return await this.usersRepository.manager.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        relations: ['clan'],
      });
      if (!user || !user.clanId)
        throw new ConflictException('Nem vagy tagja egy bandának sem.');

      const clanId = user.clanId;
      const isLeader = user.clanRank === ClanRank.LEADER;

      // Reset user
      user.clanId = null;
      user.clanRank = null;
      await manager.save(User, user);

      if (isLeader) {
        // Ha a vezér lép ki, töröljük a bandát (egyszerűsítés)
        // Előbb a többi tagot is ki kell dobni vagy nullázni
        await manager.update(
          User,
          { clanId },
          { clanId: null, clanRank: null },
        );
        await manager.delete(Clan, { id: clanId });
        return { message: 'A banda feloszlott, mivel a vezér kilépett.' };
      }

      return { message: 'Sikeresen kiléptél a bandából.' };
    });
  }

  async findAll(): Promise<Clan[]> {
    // Listázzuk a bandákat taglétszámmal
    return this.clansRepository.find({
      relations: ['members'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Clan> {
    const clan = await this.clansRepository.findOne({
      where: { id },
      relations: ['members', 'leader'],
    });
    if (!clan) throw new NotFoundException('Banda nem található.');
    return clan;
  }

  async getTopClans(): Promise<any[]> {
    // Bandák rendezése a tagok össz XP-je alapján
    const clans = await this.clansRepository
      .createQueryBuilder('clan')
      .leftJoinAndSelect('clan.members', 'member')
      .select('clan.id', 'id')
      .addSelect('clan.name', 'name')
      .addSelect('clan.tag', 'tag')
      .addSelect('COUNT(member.id)', 'memberCount')
      .addSelect('SUM(member.xp)', 'totalXp')
      .groupBy('clan.id')
      .orderBy('"totalXp"', 'DESC')
      .take(50)
      .getRawMany();

    return clans;
  }

  // ==================== CLAN UPGRADES ====================

  /**
   * Buy clan upgrade (only leader can buy)
   */
  async buyUpgrade(
    leaderId: string,
    upgradeType: ClanUpgradeType,
  ): Promise<{ message: string; newLevel: number; remainingBank: string }> {
    return await this.clansRepository.manager.transaction(async (manager) => {
      // Get user and validate leader
      const user = await manager.findOne(User, {
        where: { id: leaderId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user || !user.clanId) {
        throw new BadRequestException('Nem vagy tagja egy bandának sem!');
      }

      if (user.clanRank !== ClanRank.LEADER) {
        throw new BadRequestException('Csak a banda vezére vásárolhat fejlesztést!');
      }

      // Get clan with lock
      const clan = await manager.findOne(Clan, {
        where: { id: user.clanId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!clan) {
        throw new NotFoundException('Banda nem található!');
      }

      // Get or create upgrade
      let upgrade = await manager.findOne(ClanUpgrade, {
        where: { clanId: clan.id, type: upgradeType },
      });

      if (!upgrade) {
        upgrade = manager.create(ClanUpgrade, {
          clanId: clan.id,
          type: upgradeType,
          level: 0,
        });
      }

      // Check max level
      const definition = CLAN_UPGRADES[upgradeType];
      if (upgrade.level >= definition.maxLevel) {
        throw new BadRequestException(
          `Ez a fejlesztés már elérte a maximum szintet (${definition.maxLevel})!`,
        );
      }

      // Calculate cost
      const cost = calculateUpgradeCost(upgradeType, upgrade.level);
      const clanBank = parseInt(clan.bank);

      if (clanBank < cost) {
        throw new BadRequestException(
          `Nincs elég pénz a banda kasszájában! Szükséges: $${cost.toLocaleString()}, Elérhető: $${clanBank.toLocaleString()}`,
        );
      }

      // Deduct from bank
      clan.bank = (clanBank - cost).toString();
      await manager.save(Clan, clan);

      // Upgrade level
      upgrade.level += 1;
      await manager.save(ClanUpgrade, upgrade);

      return {
        message: `${definition.name} sikeresen fejlesztve ${upgrade.level}. szintre!`,
        newLevel: upgrade.level,
        remainingBank: clan.bank,
      };
    });
  }

  /**
   * Get all clan upgrades
   */
  async getClanUpgrades(clanId: string): Promise<ClanUpgrade[]> {
    const upgrades = await this.clanUpgradesRepository.find({
      where: { clanId },
    });

    // Ensure all upgrade types exist (even if level 0)
    const allUpgrades: ClanUpgrade[] = [];
    for (const type of Object.values(ClanUpgradeType)) {
      const existing = upgrades.find((u) => u.type === type);
      if (existing) {
        allUpgrades.push(existing);
      } else {
        // Create placeholder (not saved to DB)
        const placeholder = new ClanUpgrade();
        placeholder.clanId = clanId;
        placeholder.type = type;
        placeholder.level = 0;
        allUpgrades.push(placeholder);
      }
    }

    return allUpgrades;
  }

  /**
   * Get specific upgrade level for a clan
   */
  async getUpgradeLevel(
    clanId: string,
    upgradeType: ClanUpgradeType,
  ): Promise<number> {
    const upgrade = await this.clanUpgradesRepository.findOne({
      where: { clanId, type: upgradeType },
    });

    return upgrade ? upgrade.level : 0;
  }
}
