import { Controller, Get, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { UsersService } from '../users/users.service';
import { ClansService } from '../clans/clans.service';
import { PublicUserDto } from '../users/dto/public-user.dto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private readonly usersService: UsersService,
    private readonly clansService: ClansService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  @Get('players')
  async getTopPlayers() {
    const cacheKey = 'leaderboard_players';

    // Step 1: Check cache
    const cached = await this.cacheManager.get<PublicUserDto[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Step 2: Query database
    const players = await this.usersService.getTopPlayers();
    const result = players.map(player => new PublicUserDto(player));

    // Step 3: Save to cache (TTL: 60 seconds)
    await this.cacheManager.set(cacheKey, result, 60000);

    return result;
  }

  @Get('rich')
  async getRichestPlayers() {
    const cacheKey = 'leaderboard_rich';

    // Step 1: Check cache
    const cached = await this.cacheManager.get<PublicUserDto[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Step 2: Query database
    const players = await this.usersService.getRichestPlayers();
    const result = players.map(player => new PublicUserDto(player));

    // Step 3: Save to cache (TTL: 60 seconds)
    await this.cacheManager.set(cacheKey, result, 60000);

    return result;
  }

  @Get('clans')
  async getTopClans() {
    const cacheKey = 'leaderboard_clans';

    // Step 1: Check cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Step 2: Query database
    const result = await this.clansService.getTopClans();

    // Step 3: Save to cache (TTL: 60 seconds)
    await this.cacheManager.set(cacheKey, result, 60000);

    return result;
  }
}
