import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FeatureFlag {
  @Field(() => ID)
  id: string;

  @Field()
  key: string;

  @Field()
  label: string;

  @Field()
  description: string;

  @Field()
  enabled: boolean;

  @Field()
  locked: boolean;

  @Field({ nullable: true })
  enabledAt?: Date;
}
