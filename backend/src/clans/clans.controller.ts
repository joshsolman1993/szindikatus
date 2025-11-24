import { Controller, Get, Post, Body, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { ClansService } from './clans.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clans')
export class ClansController {
    constructor(private readonly clansService: ClansService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Request() req, @Body() createClanDto: { name: string; tag: string; description?: string }) {
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
}
