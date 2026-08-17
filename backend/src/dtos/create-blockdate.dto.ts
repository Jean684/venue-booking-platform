import { IsString, IsNotEmpty, IsDateString } from "class-validator";

export class CreateBlockdateDTO {
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  venueId: string;
}