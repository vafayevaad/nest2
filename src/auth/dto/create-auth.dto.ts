import { IsEmail, IsString, Length } from "class-validator";

export class CreateAuthDto {
  @IsString({message: "string typeda bo'lishi kerak"})
  @Length(3, 50)
  username!: string;

  @IsString()
  @IsEmail()
  @Length(15, 50)
  email!: string;

  @IsString()
  @Length(8, 200)
  password: string;
}

export class CreateLoginDto {
  @IsString()
  @IsEmail()
  @Length(12, 50)
  email!: string;

  @IsString()
  @Length(8, 200)
  password: string;
}

export class verifyDto {
  @IsString()
  @IsEmail()
  @Length(12, 50)
  email!: string;

  @IsString()
  @Length(6, 6)
  code!: string;
}