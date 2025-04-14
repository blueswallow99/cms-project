import { ICommandHandler, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DeleteCustomerCommand } from '../commands/delete-customer.command';
import { ICustomerRepository, Customer } from '@cms-project/customer-domain';

@QueryHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<DeleteCustomerCommand> {
  constructor(private customerRepository: ICustomerRepository) {}

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