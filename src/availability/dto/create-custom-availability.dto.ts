import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomAvailabilityDto {
  @IsNotEmpty()
  doctorId: number;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}