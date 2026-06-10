import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { MemberRole } from '@/common/graphql/enums';

@InputType()
export class InviteToOrganizationInput {
  @Field(() => ID)
  @IsString()
  orgId: string;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => MemberRole, { nullable: true })
  @IsOptional()
  @IsEnum(MemberRole)
  role?: MemberRole;
}
