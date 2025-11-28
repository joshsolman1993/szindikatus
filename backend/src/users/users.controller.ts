import {
  Controller,
  Get,
  Post,
  Patch,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GameBalance } from '../config/game-balance.config';
import { PublicUserDto } from './dto/public-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    const combatStats = await this.usersService.calculateCombatStats(
      req.user.userId,
    );
    return {
      ...user,
      maxEnergy: GameBalance.MAX_ENERGY,
      maxNerve: GameBalance.MAX_NERVE,
      maxHp: GameBalance.MAX_HP,
      computed: combatStats,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updatedUser = await this.usersService.updateProfile(
      req.user.userId,
      updateProfileDto,
    );
    return {
      message: 'Profil sikeresen frissítve!',
      bio: updatedUser.bio,
      settings: updatedUser.settings,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refill-energy')
  async refillEnergy(@Request() req) {
    // Dev-only endpoint: Production-ben az automatikus regeneráció működik
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Manual refill is disabled in production. Use automatic regeneration.',
      );
    }

    await this.usersService.refillEnergy(req.user.userId);
    return { message: 'Energia és HP feltöltve! (Dev mode)' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('train')
  async train(@Request() req, @Body() body: { stat: string }) {
    const user = await this.usersService.train(req.user.userId, body.stat);
    return {
      message: 'Sikeres edzés!',
      stats: user.stats,
      energy: user.energy,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPlayers(@Request() req) {
    const players = await this.usersService.findAllExcept(req.user.userId);

    const playersWithStats = await Promise.all(
      players.map(async (player) => {
        const stats = await this.usersService.calculateCombatStats(player.id);
        return new PublicUserDto(player, stats);
      }),
    );

    return playersWithStats;
  }
}
