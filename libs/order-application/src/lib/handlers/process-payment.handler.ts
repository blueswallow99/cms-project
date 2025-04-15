import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProcessPaymentCommand } from '../commands/process-payment.command';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
  OrderStatus,
} from '@cms-project/order-domain';
import { IPaymentService } from '@cms-project/payment-domain';
import { OrderRepository } from '@cms-project/infrastructure-db';
import { Inject } from '@nestjs/common';
import { MockPaymentService } from '@cms-project/payment-application';

@CommandHandler(ProcessPaymentCommand)
export class ProcessPaymentHandler
  implements ICommandHandler<ProcessPaymentCommand>
{
  constructor(
    @Inject(ORDER_REPOSITORY)
    private orderRepository: OrderRepository,
    private paymentService: MockPaymentService
  ) {}

  async execute(command: ProcessPaymentCommand): Promise<any> {
    const { orderId, paymentData } = command;

    // Get order
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Process payment
    const paymentResult = await this.paymentService.processPayment(
      orderId,
      order.getTotalAmount(),
      paymentData
    );

    if (paymentResult.success) {
      if (!paymentResult.transactionId) {
        throw new Error('Missing transaction ID for successful payment');
      }
      order.assignPayment(paymentResult.transactionId);
      order.updateStatus(OrderStatus.PAID);
      await this.orderRepository.update(order);

      return {
        success: true,
        transactionId: paymentResult.transactionId,
        message: 'Payment processed successfully',
      };
    } else {
      return {
        success: false,
        errorMessage: paymentResult.errorMessage || 'Payment processing failed',
      };
    }
  }
}
