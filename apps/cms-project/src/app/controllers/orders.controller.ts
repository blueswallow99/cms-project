import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '@cms-project/infrastructure-auth';
import {
  CreateOrderCommand,
  UpdateOrderStatusCommand,
  ProcessPaymentCommand,
  DeleteOrderCommand,
  OrderMapper,
} from '@cms-project/order-application';
import {
  GetOrderQuery,
  GetCustomerOrdersQuery,
} from '@cms-project/order-application';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  ProcessPaymentDto,
} from '../dtos/order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private readonly orderMapper: OrderMapper
  ) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const domainItems = this.orderMapper.toOrderItems(createOrderDto.items);

    const command = new CreateOrderCommand(
      createOrderDto.customerId,
      domainItems
    );
    const orderId = await this.commandBus.execute(command);
    return { id: orderId, message: 'Order created successfully' };
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    const query = new GetOrderQuery(id);
    return this.queryBus.execute(query);
  }

  @Get('customer/:customerId')
  async getCustomerOrders(@Param('customerId') customerId: string) {
    const query = new GetCustomerOrdersQuery(customerId);
    return this.queryBus.execute(query);
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto
  ) {
    const command = new UpdateOrderStatusCommand(
      id,
      updateOrderStatusDto.status
    );
    await this.commandBus.execute(command);
    return { message: 'Order status updated successfully' };
  }

  @Post(':id/payment')
  async processPayment(
    @Param('id') id: string,
    @Body() processPaymentDto: ProcessPaymentDto
  ) {
    const command = new ProcessPaymentCommand(id, processPaymentDto);
    const result = await this.commandBus.execute(command);
    return result;
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    const command = new DeleteOrderCommand(id);
    await this.commandBus.execute(command);
    return { message: 'Order deleted successfully' };
  }
}
