import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}