import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PresenceStatus } from '@/common/graphql/enums';

@InputType()
export class SetStatusInput {
  @Field(() => PresenceStatus)
  @IsEnum(PresenceStatus)
  status: PresenceStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  emoji?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  customText?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isManual?: boolean;
}
