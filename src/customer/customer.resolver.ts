import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import { GetCustomerInput, UpdateCustomerInput } from './dto/customer.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer])
  async customers(@Args('data') { skip, take, where }: GetCustomerInput) {
    return this.customerService.findAll({ skip, take, where });
  }

  @Mutation(() => Customer)
  async updateCustomer(
    @Args('email') email: string,
    @Args('data') data: UpdateCustomerInput,
  ) {
    return this.customerService.update(email, data);
  }

  @Mutation(() => Customer)
  async removeCustomer(@Args('email') email: string) {
    return this.customerService.remove(email);
  }
}
