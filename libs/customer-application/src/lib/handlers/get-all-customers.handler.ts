import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllCustomersQuery } from '../queries/get-all-customers.query';
import { ICustomerRepository, Customer } from '@cms-project/customer-domain';

@QueryHandler(GetAllCustomersQuery)
export class GetAllCustomersHandler implements IQueryHandler<GetAllCustomersQuery> {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(_: GetAllCustomersQuery): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }
}