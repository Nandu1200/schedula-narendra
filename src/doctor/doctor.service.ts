import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';

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
      throw new BadRequestException('Doctor profile already exists');
    }

    const profile = this.doctorRepository.create(data);
    return this.doctorRepository.save(profile);
  }

  async getProfile() {
    const profiles = await this.doctorRepository.find();

    if (!profiles.length) {
      throw new NotFoundException('Doctor profile not found');
    }

    return profiles;
  }

  async updateProfile(id: number, data: Partial<DoctorProfile>) {
    await this.doctorRepository.update(id, data);

    return this.doctorRepository.findOne({
      where: { id },
    });
  }

  async getDoctors(
    search?: string,
    specialization?: string,
    page?: number,
    limit?: number,
  ) {
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    if (page < 1 || limit < 1) {
  throw new BadRequestException(
    'Invalid pagination values',
  );
}

    if (search) {
      return this.doctorRepository.find({
        where: {
          fullName: ILike(`%${search}%`),
        },
      });
    }

    if (specialization) {
      return this.doctorRepository.find({
        where: {
          specialization: ILike(`%${specialization}%`),
        },
      });
    }

    return this.doctorRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getDoctorById(id: number) {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }
}
