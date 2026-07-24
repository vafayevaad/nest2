import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateArticleDto {
  @ApiProperty({description: "JavaScript"})
  @IsString()
  title!: string

  @ApiProperty({description: "The best programming language in the world!"})
  @IsString()
  text!: string
}
