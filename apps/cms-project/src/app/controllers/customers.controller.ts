import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '@cms-project/infrastructure-auth';
import { CreateCustomerCommand, UpdateCustomerCommand, DeleteCustomerCommand } from '@cms-project/customer-application';
import { GetCustomerQuery, GetAllCustomersQuery } from '@cms-project/customer-application';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  //How can I create a customer before signing in?
  //since the sign in method only allows existing customers I took the need for verficition in creating the customer off, so just for the sake of testing we can create a customer first
  //in pratice I know this is not a best practice
  @Post()
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    const command = new CreateCustomerCommand(
      createCustomerDto.email,
      createCustomerDto.firstName,
      createCustomerDto.lastName,
      createCustomerDto.password,
    );
    await this.commandBus.execute(command);
    return { message: 'Customer created successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCustomer(@Param('id') id: string) {
    const query = new GetCustomerQuery(id);
    return this.queryBus.execute(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllCustomers() {
    const query = new GetAllCustomersQuery();
    return this.queryBus.execute(query);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const command = new UpdateCustomerCommand(
      id,
      updateCustomerDto.firstName,
      updateCustomerDto.lastName,
    );
    await this.commandBus.execute(command);
    return { message: 'Customer updated successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCustomer(@Param('id') id: string) {
    const command = new DeleteCustomerCommand(id);
    await this.commandBus.execute(command);
    return { message: 'Customer deleted successfully' };
  }
}