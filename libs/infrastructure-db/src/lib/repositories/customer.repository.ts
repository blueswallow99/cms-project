import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../entities/customer.entity';
import { ICustomerRepository, Customer } from '@cms-project/customer-domain';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepo: Repository<CustomerEntity>
  ) {}

  async findById(id: string): Promise<Customer | null> {
    const customerEntity = await this.customerRepo.findOne({ where: { id } });
    if (!customerEntity) return null;

    return this.mapToDomain(customerEntity);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customerEntity = await this.customerRepo.findOne({
      where: { email },
    });
    if (!customerEntity) return null;

    return this.mapToDomain(customerEntity);
  }

  async save(customer: Customer): Promise<void> {
    const entity = this.mapToEntity(customer);
    await this.customerRepo.save(entity);
  }

  async update(customer: Customer): Promise<void> {
    const entity = this.mapToEntity(customer);
    await this.customerRepo.update(customer.getId(), entity);
  }

  async delete(id: string): Promise<void> {
    await this.customerRepo.delete(id);
  }

  async findAll(): Promise<Customer[]> {
    const entities = await this.customerRepo.find();
    return entities.map((entity) => this.mapToDomain(entity));
  }

  private mapToDomain(entity: CustomerEntity): Customer {
    const customer = Customer.create(
      entity.id,
      entity.email,
      entity.firstName,
      entity.lastName,
      entity.passwordHash
    );
    return customer;
  }

  private mapToEntity(domain: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    entity.id = domain.getId();
    entity.email = domain.getEmail();
    entity.firstName = domain.getFirstName();
    entity.lastName = domain.getLastName(); 
    entity.passwordHash = domain.getPasswordHash(); 
    entity.createdAt = domain.getCreatedAt(); 
    entity.updatedAt = domain.getUpdatedAt(); 
    return entity;
  }
}
