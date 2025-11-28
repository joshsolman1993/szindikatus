import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Érvénytelen email formátum' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A felhasználónév nem lehet üres' })
  @MinLength(3, { message: 'A felhasználónév legalább 3 karakter legyen' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'A jelszó nem lehet üres' })
  @MinLength(6, { message: 'A jelszó legalább 6 karakter legyen' })
  password: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Érvénytelen email formátum' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A jelszó nem lehet üres' })
  password: string;
}
