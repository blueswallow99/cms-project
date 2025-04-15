import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCustomerCommand } from '../commands/update-customer.command';
import { CUSTOMER_REPOSITORY, ICustomerRepository } from '@cms-project/customer-domain';
import * as bcrypt from 'bcrypt';
import { Inject } from '@nestjs/common';
import { CustomerRepository } from '@cms-project/infrastructure-db';

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler implements ICommandHandler<UpdateCustomerCommand> {
  constructor(@Inject(CUSTOMER_REPOSITORY)
  private customerRepository: CustomerRepository,) {}

  async execute(command: UpdateCustomerCommand): Promise<void> {
    const { id, email, firstName, lastName, password } = command;

    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    if (email) customer.updateEmail(email);
    if (firstName && lastName) customer.updatePersonalInfo(firstName, lastName);
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      customer.setPasswordHash(passwordHash);
    }

    await this.customerRepository.save(customer);
  }
}