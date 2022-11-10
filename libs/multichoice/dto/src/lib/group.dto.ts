import { validation } from '@monorepo/multichoice/validation';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  name: string;

  // @ApiProperty({
  //   isArray: true,
  //   type: Number,
  // })
  // arrayUser: number[];
}

export class AddUserGroupDto {
  @ApiProperty()
  groupID: number;

  @ApiProperty()
  @IsEmail()
  @MaxLength(validation().email.maxLength)
  email: string;
}
