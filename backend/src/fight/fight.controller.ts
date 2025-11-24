import { Controller, Post, Param, UseGuards, Request } from '@nestjs/common';
import { FightService } from './fight.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('fight')
export class FightController {
    constructor(private readonly fightService: FightService) { }

    @UseGuards(JwtAuthGuard)
    @Post('attack/:targetId')
    async attack(@Request() req, @Param('targetId') targetId: string) {
        const result = await this.fightService.executeFight(req.user.userId, targetId);
        return result;
    }
}
