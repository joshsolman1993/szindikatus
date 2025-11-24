import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { MarketService } from './market.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('market')
export class MarketController {
    constructor(private readonly marketService: MarketService) { }

    @UseGuards(JwtAuthGuard)
    @Get('shop')
    async getShopItems() {
        return this.marketService.getShopItems();
    }

    @UseGuards(JwtAuthGuard)
    @Post('buy/:itemId')
    async buyItem(@Request() req, @Param('itemId') itemId: string) {
        return this.marketService.buyItem(req.user.userId, itemId);
    }
}
