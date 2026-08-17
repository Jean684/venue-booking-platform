import { IsDate, IsDateString, IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateAppDTO {
  @IsNotEmpty()
  @IsString()
  eventName: string;
  
  @IsNotEmpty()
  @IsNumber()
  guestCount: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  venueId: string;
  
}