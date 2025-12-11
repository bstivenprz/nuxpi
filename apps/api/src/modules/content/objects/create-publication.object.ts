import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { PublicationType } from '../entities/publication.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicationBody {
  @ApiProperty()
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiProperty()
  @IsEnum(PublicationType)
  @IsOptional()
  type?: PublicationType;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  assets?: string[];
}
