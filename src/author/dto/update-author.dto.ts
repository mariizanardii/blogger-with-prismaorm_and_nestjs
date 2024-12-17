import { IsOptional, IsString } from 'class-validator';

export class UpdateAuthorDto {
  @IsString()
  @IsOptional()
  surname?: string;

  @IsString()
  @IsOptional()
  completeName?: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  is_a_user?: string;
}