import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IssueType, Priority } from '@/common/graphql/enums';

@InputType()
export class SubmitIntakeFormInput {
  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @Field(() => IssueType, { nullable: true })
  @IsOptional()
  @IsEnum(IssueType)
  type?: IssueType;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  reporterName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  @MaxLength(160)
  reporterEmail?: string;

  /**
   * Honeypot. Real users never see this field; bots fill it. If present, the
   * submission is silently dropped (treated as success) and no issue is created.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  company?: string;
}
