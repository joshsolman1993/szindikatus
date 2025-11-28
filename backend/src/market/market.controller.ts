import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { MarketService } from './market.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

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

  // ==================== PLAYER MARKETPLACE ====================

  @UseGuards(JwtAuthGuard)
  @Get('listings')
  async getListings() {
    return this.marketService.getListings();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-listings')
  async getMyListings(@Request() req) {
    return this.marketService.getMyListings(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-listing')
  async createListing(
    @Request() req,
    @Body('inventoryId') inventoryId: string,
    @Body('price') price: string,
  ) {
    return this.marketService.createListing(
      req.user.userId,
      inventoryId,
      price,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('buy-listing/:listingId')
  async buyListing(@Request() req, @Param('listingId') listingId: string) {
    return this.marketService.buyListing(req.user.userId, listingId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel-listing/:listingId')
  async cancelListing(@Request() req, @Param('listingId') listingId: string) {
    return this.marketService.cancelListing(req.user.userId, listingId);
  }
}
