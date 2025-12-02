import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class ProfileObject {
  username: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  presentation: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(['male', 'female', 'lgbtiq', 'prefer_not_say'])
  @AutoMap(() => String)
  gender: 'male' | 'female' | 'lgbtiq' | 'prefer_not_say';

  picture?: string;

  cover?: string;
}
