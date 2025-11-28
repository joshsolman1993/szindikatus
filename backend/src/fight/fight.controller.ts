import { Controller, Post, Param, UseGuards, Request } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { FightService } from './fight.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('fight')
export class FightController {
  constructor(private readonly fightService: FightService) { }

  @UseGuards(JwtAuthGuard)
  @Post('attack/:targetId')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  async attack(@Request() req, @Param('targetId') targetId: string) {
    const result = await this.fightService.executeFight(
      req.user.userId,
      targetId,
    );
    return result;
  }
}
