import { IsInt, IsNotEmpty, IsOptional, IsString, Min, } from "class-validator";

export class CreateVenueDto {
  @IsNotEmpty()
  @IsString()
  heading!: string;

  @IsNotEmpty()
  @IsString()
  imgUrl!: string;

  @IsInt()
  @Min(1)
  guests!: number;

  @IsNotEmpty()
  @IsString()
  location!: string;

  @IsInt()
  @Min(1)
  price!: number;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  keywords!: string;
}