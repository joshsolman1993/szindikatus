import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CasinoService } from './casino.service';
import { CoinflipDto, SpinDto } from './dto/casino.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('casino')
@UseGuards(JwtAuthGuard)
export class CasinoController {
    constructor(private readonly casinoService: CasinoService) { }

    @Post('coinflip')
    coinflip(@Request() req, @Body() dto: CoinflipDto) {
        return this.casinoService.coinflip(req.user.userId, dto.amount, dto.choice);
    }

    @Post('spin')
    spin(@Request() req, @Body() dto: SpinDto) {
        return this.casinoService.spin(req.user.userId, dto.amount);
    }
}
