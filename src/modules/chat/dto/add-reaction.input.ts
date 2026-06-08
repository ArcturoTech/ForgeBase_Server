import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

const EMOJI_PATTERN = /^(\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji}️?)(‍(\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji}️?))*$/u;

@InputType()
export class AddReactionInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @Matches(EMOJI_PATTERN, { message: 'Emoji inválido' })
  emoji: string;
}
