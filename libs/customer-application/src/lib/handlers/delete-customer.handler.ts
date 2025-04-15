import { ICommandHandler, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DeleteCustomerCommand } from '../commands/delete-customer.command';
import { ICustomerRepository, Customer, CUSTOMER_REPOSITORY } from '@cms-project/customer-domain';
import { CustomerRepository } from '@cms-project/infrastructure-db';
import { Inject } from '@nestjs/common';

@QueryHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<DeleteCustomerCommand> {
  constructor(@Inject(CUSTOMER_REPOSITORY)
  private customerRepository: CustomerRepository,) {}

  async execute(command: DeleteCustomerCommand): Promise<Customer> {
    const { id } = command;
    const customer = await this.customerRepository.findById(id);
    
    if (!customer) {
      throw new Error('Customer not found');
    }
    
    await this.customerRepository.delete(id)
    return customer;
  }
}