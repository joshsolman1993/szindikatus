import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { CrimesService } from './crimes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('crimes')
export class CrimesController {
  constructor(private readonly crimesService: CrimesService) {}

  @Get()
  findAll() {
    return this.crimesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('commit/:id')
  commit(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.crimesService.commitCrime(req.user.userId, id);
  }
}
