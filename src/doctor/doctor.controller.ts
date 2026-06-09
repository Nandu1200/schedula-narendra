import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  createProfile(
    @Body() body: CreateDoctorDto,
    @Req() req: any,
  ) {
    return this.doctorService.createProfile({
      ...body,
      userId: req.user.userId,
    });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  getProfile() {
    return this.doctorService.getProfile();
  }

  @Patch('profile/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  updateProfile(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.doctorService.updateProfile(+id, body);
  }
}