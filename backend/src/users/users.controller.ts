import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GameBalance } from '../config/game-balance.config';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const user = await this.usersService.findById(req.user.userId);
        return {
            ...user,
            maxEnergy: GameBalance.MAX_ENERGY,
            maxNerve: GameBalance.MAX_NERVE,
            maxHp: GameBalance.MAX_HP,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post('refill-energy')
    async refillEnergy(@Request() req) {
        await this.usersService.refillEnergy(req.user.userId);
        return { message: 'Energia és HP feltöltve!' };
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
}
