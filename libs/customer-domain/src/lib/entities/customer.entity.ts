import { AggregateRoot } from '@nestjs/cqrs';

export class Customer extends AggregateRoot {
  private readonly id: string;
  private email!: string;
  private firstName!: string;
  private lastName!: string;
  private passwordHash!: string;
  private createdAt!: Date;
  private updatedAt!: Date;

  constructor(id: string) {
    super();
    this.id = id;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  //Update methods
  updatePersonalInfo(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.updatedAt = new Date();
  }

  updateEmail(email: string) {
    //TODO: add validation later
    this.email = email;
    this.updatedAt = new Date();
  }

  setPasswordHash(hash: string) {
    this.passwordHash = hash;
    this.updatedAt = new Date();
  }

  // Factory method
  static create(id: string, email: string, firstName: string, lastName: string, passwordHash: string): Customer {
    const customer = new Customer(id);
    customer.email = email;
    customer.firstName = firstName;
    customer.lastName = lastName;
    customer.passwordHash = passwordHash;
    customer.createdAt = new Date();
    customer.updatedAt = new Date();
    return customer;
  }
}