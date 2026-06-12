import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PersonalSprintSnapshot {
  @Field(() => ID)
  id: string;

  @Field()
  sprintId: string;

  @Field()
  capturedOn: Date;

  @Field(() => Int)
  totalTasks: number;

  @Field(() => Int)
  completedTasks: number;

  @Field(() => Int)
  remainingTasks: number;
}

@ObjectType()
export class PersonalVelocityPoint {
  @Field()
  sprintId: string;

  @Field()
  name: string;

  @Field(() => Int)
  totalTasks: number;

  @Field(() => Int)
  completedTasks: number;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;
}
