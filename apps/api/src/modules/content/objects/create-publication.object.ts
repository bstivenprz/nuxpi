import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicationBody {
  @ApiProperty()
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  assets?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  audience?: string;
}
