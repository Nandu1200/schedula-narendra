import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AvailabilityService } from './availability.service';

import { CreateRecurringAvailabilityDto } from './dto/create-recurring-availability.dto';
import { CreateCustomAvailabilityDto } from './dto/create-custom-availability.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('doctor/availability')
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  create(
    @Body()
    createRecurringAvailabilityDto: CreateRecurringAvailabilityDto,
  ) {
    return this.availabilityService.createRecurringAvailability(
      createRecurringAvailabilityDto,
    );
  }

  @Get()
  getAllAvailability() {
    return this.availabilityService.getAllRecurringAvailability();
  }

  @Post('override')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  createOverride(
    @Body()
    createCustomAvailabilityDto: CreateCustomAvailabilityDto,
  ) {
    return this.availabilityService.createCustomAvailability(
      createCustomAvailabilityDto,
    );
  }

  @Get('override')
  getAllOverrides() {
    return this.availabilityService.getAllCustomAvailability();
  }

  @Get('date')
  getAvailabilityByDate(
    @Query('date') date: string,
  ) {
    return this.availabilityService.getAvailabilityByDate(
      date,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  updateAvailability(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.availabilityService.updateRecurringAvailability(
      +id,
      body,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  deleteAvailability(
    @Param('id') id: string,
  ) {
    return this.availabilityService.deleteRecurringAvailability(
      +id,
    );
  }
}