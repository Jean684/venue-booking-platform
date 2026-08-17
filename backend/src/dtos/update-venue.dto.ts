import {IsInt, IsOptional, IsString, Min} from "class-validator";

export class UpdateVenueDto {
  @IsOptional()
  @IsString()
  heading?: string;

  @IsOptional()
  @IsString()
  imgUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  guests?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  keywords?: string;
}