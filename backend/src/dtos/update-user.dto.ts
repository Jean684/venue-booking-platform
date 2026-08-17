import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
