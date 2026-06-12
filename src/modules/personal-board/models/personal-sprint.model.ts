import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { PersonalSprintStatus } from '@/common/graphql/enums';

@ObjectType()
export class PersonalSprint {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => PersonalSprintStatus)
  status: PersonalSprintStatus;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => Int, { nullable: true })
  targetPoints?: number;

  @Field({ nullable: true })
  parentSprintId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
