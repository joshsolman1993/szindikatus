import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserItems(@Request() req) {
        return this.inventoryService.getUserItems(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('equip/:inventoryId')
    async equipItem(@Request() req, @Param('inventoryId') inventoryId: string) {
        return this.inventoryService.equipItem(req.user.userId, inventoryId);
    }
}
