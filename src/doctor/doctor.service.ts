import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DoctorProfile } from './doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(DoctorProfile)
    private doctorRepository: Repository<DoctorProfile>,
  ) {}

  async createProfile(data: Partial<DoctorProfile>) {
    const existingProfile = await this.doctorRepository.findOne({
      where: {
        userId: data.userId,
      },
    });

    if (existingProfile) {
      throw new BadRequestException(
        'Doctor profile already exists',
      );
    }

    const profile = this.doctorRepository.create(data);
    return this.doctorRepository.save(profile);
  }

  async getProfile() {
    const profiles = await this.doctorRepository.find();

    if (!profiles.length) {
      throw new NotFoundException(
        'Doctor profile not found',
      );
    }

    return profiles;
  }

  async updateProfile(id: number, data: Partial<DoctorProfile>) {
    await this.doctorRepository.update(id, data);

    return this.doctorRepository.findOne({
      where: { id },
    });
  }
}