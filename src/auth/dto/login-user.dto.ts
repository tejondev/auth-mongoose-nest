import { Transform } from 'class-transformer';
import { IsEmail, Matches } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password requires 6 characters, includes; 1 uppercase letter, 1 lowercase letter, and 1 number',
  })
  password: string;
}
