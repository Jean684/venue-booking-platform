import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name!: string;
  
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email!: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(["vendor", "hirer"])
  role!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/, {
    message: "Password must be at least 6 characters long and include uppercase, lowercase, and special character.",
  })
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  phone?: string;
}