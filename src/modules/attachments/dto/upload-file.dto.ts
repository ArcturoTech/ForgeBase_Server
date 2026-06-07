import { IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  @IsString()
  orgId: string;

  @IsOptional()
  @IsString()
  targetType?: string;

  @IsOptional()
  @IsString()
  targetId?: string;
}
