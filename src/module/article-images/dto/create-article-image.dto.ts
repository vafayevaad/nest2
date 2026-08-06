import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateArticleImageDto {
  @IsNumber()
  @ApiProperty()
  articleId!: number
  
@IsString()
@ApiProperty({type: "string", format: "binary"})
  backgroundImage?: string
}

