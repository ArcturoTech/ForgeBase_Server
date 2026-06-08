import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ChatSpaceRole } from '@/common/graphql/enums';

@InputType()
export class InviteChatSpaceMemberInput {
  @Field(() => ID)
  @IsString()
  spaceId: string;

  @Field(() => ID)
  @IsString()
  userId: string;

  @Field(() => ChatSpaceRole, { nullable: true })
  @IsOptional()
  @IsEnum(ChatSpaceRole)
  role?: ChatSpaceRole;
}
