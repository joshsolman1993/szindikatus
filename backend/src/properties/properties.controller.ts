import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('properties')
@UseGuards(JwtAuthGuard)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  findAll() {
    return this.propertiesService.findAll();
  }

  @Get('my')
  findMyProperties(@Request() req) {
    return this.propertiesService.findMyProperties(req.user.userId);
  }

  @Post('buy/:id')
  buyProperty(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.buyProperty(req.user.userId, id);
  }

  @Post('collect')
  collectIncome(@Request() req) {
    return this.propertiesService.collectIncome(req.user.userId);
  }
}
