import { Controller, Get, Post, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('missions')
@UseGuards(JwtAuthGuard)
export class MissionsController {
    constructor(private readonly missionsService: MissionsService) { }

    @Get()
    getMissions(@Request() req) {
        return this.missionsService.getMissions(req.user.userId);
    }

    @Post('claim/:id')
    claimReward(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.missionsService.claimReward(req.user.userId, id);
    }
}
