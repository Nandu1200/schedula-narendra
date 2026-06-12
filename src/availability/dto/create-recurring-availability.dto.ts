import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRecurringAvailabilityDto {
  @IsNotEmpty()
  doctorId: number;

  @IsString()
  @IsNotEmpty()
  dayOfWeek: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}