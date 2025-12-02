import { lowerCaseTransformer } from '@/common/utils/transformers/lower-case.transformer';
import { ICommand } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SyncIdentityCommand implements ICommand {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(lowerCaseTransformer)
  username?: string;

  constructor(props: SyncIdentityCommand) {
    Object.assign(this, props);
  }
}
