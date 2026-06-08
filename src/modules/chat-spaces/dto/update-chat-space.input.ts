import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateChatSpaceInput } from './create-chat-space.input';

@InputType()
export class UpdateChatSpaceInput extends PartialType(
  OmitType(CreateChatSpaceInput, ['orgId'] as const),
) {}
