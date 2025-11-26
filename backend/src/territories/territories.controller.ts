import { Controller, Get, Post, Body, UseGuards, Request, Param, ParseIntPipe } from '@nestjs/common';
import { TerritoriesService } from './territories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('territories')
export class TerritoriesController {
    constructor(private readonly territoriesService: TerritoriesService) { }

    @Get()
    getMap() {
        return this.territoriesService.getMap();
    }

    @UseGuards(JwtAuthGuard)
    @Post('attack/:id')
    attackDistrict(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.territoriesService.attackDistrict(req.user.userId, id);
    }
}
