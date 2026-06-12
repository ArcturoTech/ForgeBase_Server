import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class UpdateNotificationPrefsInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  leadAssigned?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  dealUpdate?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  taskDue?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  chatMessage?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  weeklyDigest?: boolean;
}
