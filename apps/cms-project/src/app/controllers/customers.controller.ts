import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '@cms-project/infrastructure-auth';
import { CreateCustomerCommand, UpdateCustomerCommand, DeleteCustomerCommand } from '@cms-project/customer-application';
import { GetCustomerQuery, GetAllCustomersQuery } from '@cms-project/customer-application';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

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

  @Get(':id')
  async getCustomer(@Param('id') id: string) {
    const query = new GetCustomerQuery(id);
    return this.queryBus.execute(query);
  }

  @Get()
  async getAllCustomers() {
    const query = new GetAllCustomersQuery();
    return this.queryBus.execute(query);
  }

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

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string) {
    const command = new DeleteCustomerCommand(id);
    await this.commandBus.execute(command);
    return { message: 'Customer deleted successfully' };
  }
}