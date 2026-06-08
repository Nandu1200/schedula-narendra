import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  specialization: string;

  @IsNumber()
  experience: number;

  @IsString()
  @IsNotEmpty()
  qualification: string;

  @IsNumber()
  consultationFee: number;

  @IsString()
  @IsNotEmpty()
  availability: string;

  @IsOptional()
  @IsString()
  profileDetails?: string;
}