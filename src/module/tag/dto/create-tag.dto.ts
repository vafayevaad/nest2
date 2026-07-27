import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateTagDto {
  @ApiProperty({default: "HTML"})
  @IsString()
  title!: string
}
