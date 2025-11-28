import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CrimesService } from './crimes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('crimes')
export class CrimesController {
  constructor(private readonly crimesService: CrimesService) { }

  @Get()
  findAll() {
    return this.crimesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('commit/:id')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  commit(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.crimesService.commitCrime(req.user.userId, id);
  }
}
