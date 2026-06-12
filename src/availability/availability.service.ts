import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecurringAvailability } from './entities/recurring-availability.entity';
import { CustomAvailability } from './entities/custom-availability.entity';

import { CreateRecurringAvailabilityDto } from './dto/create-recurring-availability.dto';
import { CreateCustomAvailabilityDto } from './dto/create-custom-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(RecurringAvailability)
    private recurringAvailabilityRepository: Repository<RecurringAvailability>,

    @InjectRepository(CustomAvailability)
    private customAvailabilityRepository: Repository<CustomAvailability>,
  ) {}

  async createRecurringAvailability(
    createRecurringAvailabilityDto: CreateRecurringAvailabilityDto,
  ) {
    // Invalid Time Validation
    if (
      createRecurringAvailabilityDto.startTime >=
      createRecurringAvailabilityDto.endTime
    ) {
      throw new BadRequestException(
        'Start time must be less than end time',
      );
    }

    // Duplicate Validation
    const existingAvailability =
      await this.recurringAvailabilityRepository.findOne({
        where: {
          doctorId: createRecurringAvailabilityDto.doctorId,
          dayOfWeek: createRecurringAvailabilityDto.dayOfWeek,
          startTime: createRecurringAvailabilityDto.startTime,
          endTime: createRecurringAvailabilityDto.endTime,
        },
      });

    if (existingAvailability) {
      throw new BadRequestException(
        'Availability already exists',
      );
    }

    // Overlapping Validation
    const overlappingAvailability =
      await this.recurringAvailabilityRepository.findOne({
        where: {
          doctorId: createRecurringAvailabilityDto.doctorId,
          dayOfWeek: createRecurringAvailabilityDto.dayOfWeek,
        },
      });

    if (
      overlappingAvailability &&
      createRecurringAvailabilityDto.startTime <
        overlappingAvailability.endTime &&
      createRecurringAvailabilityDto.endTime >
        overlappingAvailability.startTime
    ) {
      throw new BadRequestException(
        'Overlapping time slot not allowed',
      );
    }

    const availability = this.recurringAvailabilityRepository.create(
      createRecurringAvailabilityDto,
    );

    return await this.recurringAvailabilityRepository.save(
      availability,
    );
  }

  async getAllRecurringAvailability() {
    return await this.recurringAvailabilityRepository.find();
  }

  async createCustomAvailability(
    createCustomAvailabilityDto: CreateCustomAvailabilityDto,
  ) {
    const availability = this.customAvailabilityRepository.create(
      createCustomAvailabilityDto,
    );

    return await this.customAvailabilityRepository.save(
      availability,
    );
  }

  async getAllCustomAvailability() {
    return await this.customAvailabilityRepository.find();
  }

  async getAvailabilityByDate(date: string) {
    const customAvailability =
      await this.customAvailabilityRepository.find({
        where: { date },
      });

    if (customAvailability.length > 0) {
      return customAvailability;
    }

    const dayOfWeek = new Date(date)
      .toLocaleDateString('en-US', {
        weekday: 'long',
      })
      .toUpperCase();

    return await this.recurringAvailabilityRepository.find({
      where: { dayOfWeek },
    });
  }

  async updateRecurringAvailability(
    id: number,
    updateData: Partial<RecurringAvailability>,
  ) {
    await this.recurringAvailabilityRepository.update(
      id,
      updateData,
    );

    return await this.recurringAvailabilityRepository.findOne({
      where: { id },
    });
  }
  async deleteRecurringAvailability(id: number) {
  await this.recurringAvailabilityRepository.delete(id);

  return {
    message: 'Availability deleted successfully',
  };
}
}