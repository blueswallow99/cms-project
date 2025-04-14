import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCustomerCommand } from '../commands/create-customer.command';
import { ICustomerRepository, Customer } from '@cms-project/customer-domain';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand> {
  constructor(private customerRepository: ICustomerRepository) {}

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