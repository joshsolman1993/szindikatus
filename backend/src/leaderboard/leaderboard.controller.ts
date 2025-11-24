import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ClansService } from '../clans/clans.service';
import { PublicUserDto } from '../users/dto/public-user.dto';

@Controller('leaderboard')
export class LeaderboardController {
    constructor(
        private readonly usersService: UsersService,
        private readonly clansService: ClansService,
    ) { }

    @Get('players')
    async getTopPlayers() {
        const players = await this.usersService.getTopPlayers();
        // Mivel a getTopPlayers sima User[]-t ad vissza, konvertáljuk PublicUserDto-ra
        // Itt most nem számolunk felszerelést (egyszerűsítés), vagy ha kell, akkor calculateCombatStats hívás kellene.
        // A prompt csak XP-t kért, így a statok kevésbé fontosak itt, de a PublicUserDto elvárja.
        // Egyszerűsítés: statokat null-nak vesszük vagy alapnak.
        return players.map(player => new PublicUserDto(player));
    }

    @Get('rich')
    async getRichestPlayers() {
        const players = await this.usersService.getRichestPlayers();
        return players.map(player => new PublicUserDto(player));
    }

    @Get('clans')
    async getTopClans() {
        return this.clansService.getTopClans();
    }
}
