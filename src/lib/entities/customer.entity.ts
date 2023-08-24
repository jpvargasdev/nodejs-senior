import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role, Status } from '@prisma/client';
import { Base } from 'lib/entities/base.entity';

@ObjectType()
export class Customer extends Base {
  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  name?: string;
}

registerEnumType(Role, {
  name: 'CustomerRole',
});

registerEnumType(Status, {
  name: 'CustomerStatus',
});
