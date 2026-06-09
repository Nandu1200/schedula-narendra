import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PatientProfile } from './patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientProfile)
    private patientRepository: Repository<PatientProfile>,
  ) {}

  async createProfile(data: Partial<PatientProfile>) {
    const existingProfile = await this.patientRepository.findOne({
      where: {
        userId: data.userId,
      },
    });

    if (existingProfile) {
      throw new BadRequestException(
        'Patient profile already exists',
      );
    }

    const profile = this.patientRepository.create(data);
    return this.patientRepository.save(profile);
  }

  async getProfile() {
    const profiles = await this.patientRepository.find();

    if (!profiles.length) {
      throw new NotFoundException(
        'Patient profile not found',
      );
    }

    return profiles;
  }

  async updateProfile(id: number, data: Partial<PatientProfile>) {
    await this.patientRepository.update(id, data);

    return this.patientRepository.findOne({
      where: { id },
    });
  }
}