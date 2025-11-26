import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TalentsService } from './talents.service';
import { TalentId } from './talents.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users/talents')
export class TalentsController {
    constructor(private readonly talentsService: TalentsService) { }

    @Get()
    getTalents() {
        return this.talentsService.getTalents();
    }

    @Post('learn')
    @UseGuards(JwtAuthGuard)
    learnTalent(@Request() req, @Body('talentId') talentId: TalentId) {
        return this.talentsService.learnTalent(req.user.userId, talentId);
    }
}
