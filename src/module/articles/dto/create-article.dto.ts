import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsInt, IsString } from "class-validator";

export class CreateArticleDto {
  @ApiProperty({description: "JavaScript"})
  @IsString()
  title!: string

  @ApiProperty({description: "The best programming language in the world!"})
  @IsString()
  text!: string

  @Transform(({value}) => 
    typeof value === "string" ? value.split(",").map((item) => Number(item)) : value 
  )
  @IsArray()
  @IsInt({each: true})
  @ApiProperty({default: [1, 2, 3]})
  tags!: number[]
}
