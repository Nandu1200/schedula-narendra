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

import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PATIENT)
  createProfile(
    @Body() body: CreatePatientDto,
    @Req() req: any,
  ) {
    return this.patientService.createProfile({
      ...body,
      userId: req.user.userId,
    });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PATIENT)
  getProfile() {
    return this.patientService.getProfile();
  }

  @Patch('profile/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PATIENT)
  updateProfile(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.patientService.updateProfile(+id, body);
  }
}