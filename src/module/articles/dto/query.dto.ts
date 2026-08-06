import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsOptional, IsString } from "class-validator"

export class QueryDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({default: 1, minimum: 1})
  page?: number = 1

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({default: 10, minimum: 1})
  limit?: number = 1

  @IsString()
  @IsOptional() 
  @ApiProperty()
  search?: string
}