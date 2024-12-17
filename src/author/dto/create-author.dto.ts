import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @IsNotEmpty()
  completeName: string;

  @IsString()
  tags: string;

  @IsString()
  @IsNotEmpty()
  is_a_user: string;
}