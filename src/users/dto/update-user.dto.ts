import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Tech Lead' })
  @IsString()
  @IsOptional()
  jobTitle?: string;

  @ApiPropertyOptional({ example: 'Construindo a plataforma Entur-Forge.' })
  @IsString()
  @IsOptional()
  bio?: string;
}
