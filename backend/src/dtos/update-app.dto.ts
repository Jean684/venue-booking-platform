import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDTO {
  @IsString()
  status: string;

  @IsString()
  comment: string;
}
