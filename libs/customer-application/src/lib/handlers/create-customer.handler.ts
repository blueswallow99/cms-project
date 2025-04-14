import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCustomerCommand } from '../commands/create-customer.command';
import { Customer, CUSTOMER_REPOSITORY } from '@cms-project/customer-domain';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { CustomerRepository } from '@cms-project/infrastructure-db';
import { Inject } from '@nestjs/common';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand> {
  constructor(@Inject(CUSTOMER_REPOSITORY)
  private customerRepository: CustomerRepository,) {}

  async execute(command: CreateCustomerCommand): Promise<void> {
    const { email, firstName, lastName, password } = command;
    
    const existingCustomer = await this.customerRepository.findByEmail(email);
    if (existingCustomer) {
      throw new Error('User with this email already exists');
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const customer = Customer.create(
      uuidv4(),
      email,
      firstName,
      lastName,
      passwordHash
    );
    
    await this.customerRepository.save(customer);
  }
}