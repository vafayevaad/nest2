import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateAuthDto {
  @ApiProperty({default: "diana"})
  @IsString({message: "string typeda bo'lishi kerak"})
  @Length(3, 50)
  username!: string;

  @ApiProperty({default: "dianavafoyeva220@gmail.com"})
  @IsString()
  @IsEmail()
  @Length(15, 50)
  email!: string;

  @ApiProperty({default: "12344556"})
  @IsString()
  @Length(8, 200)
  password: string;
}

export class CreateLoginDto {
  @ApiProperty({default: "dianavafoyeva220@gmail.com"})
  @IsString()
  @IsEmail()
  @Length(12, 50)
  email!: string;

  @ApiProperty({default: "12344556"})
  @IsString()
  @Length(8, 200)
  password: string;
}

export class verifyDto {
  @ApiProperty({default: "dianavafoyeva220@gmail.com"})
  @IsString()
  @IsEmail()
  @Length(12, 50)
  email!: string;

  @ApiProperty({default: "123456"})
  @IsString()
  @Length(6, 6)
  code!: string;
} 