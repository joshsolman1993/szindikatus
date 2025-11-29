import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { ClansService } from './clans.service';
import { ClanUpgradeType } from './entities/clan-upgrade.entity';
import { CLAN_UPGRADES } from './clan-upgrades.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clans')
export class ClansController {
  constructor(private readonly clansService: ClansService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req,
    @Body() createClanDto: { name: string; tag: string; description?: string },
  ) {
    return this.clansService.create(req.user.userId, createClanDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  join(@Request() req, @Param('id') id: string) {
    return this.clansService.join(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('leave')
  leave(@Request() req) {
    return this.clansService.leave(req.user.userId);
  }

  @Get()
  findAll() {
    return this.clansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clansService.findOne(id);
  }

  // ==================== CLAN UPGRADES ====================

  @Get('upgrades/definitions')
  getUpgradeDefinitions() {
    return CLAN_UPGRADES;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/upgrades')
  getClanUpgrades(@Param('id') id: string) {
    return this.clansService.getClanUpgrades(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upgrades/buy')
  buyUpgrade(@Request() req, @Body('upgradeType') upgradeType: ClanUpgradeType) {
    return this.clansService.buyUpgrade(req.user.userId, upgradeType);
  }
}
