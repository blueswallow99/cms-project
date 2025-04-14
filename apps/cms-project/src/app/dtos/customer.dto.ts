import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateCustomerDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}