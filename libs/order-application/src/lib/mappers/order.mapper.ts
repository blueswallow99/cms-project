import { Injectable } from '@nestjs/common';
import { Order, OrderStatus, OrderItem } from '@cms-project/order-domain';
import { OrderDto, OrderItemDto, OrderStatusDto } from '../dtos/order.dto';

@Injectable()
export class OrderMapper {
  toDto(order: Order): OrderDto {
    return {
      id: order.getId(),
      customerId: order.getCustomerId(),
      items: order.getItems().map(item => this.toOrderItemDto(item)),
      status: order.getStatus() as unknown  as OrderStatusDto,
      totalAmount: order.getTotalAmount(),
      paymentTransactionId: order.getPaymentId(),
      createdAt: order.getCreatedAt(),
      updatedAt: order.getUpdatedAt(),
    };
  }

  private toOrderItemDto(item: OrderItem): OrderItemDto {
    return {
      productId: item.getProductId(),
      name: item.getName(),
      price: item.getPrice(),
      quantity: item.getQuantity(),
    };
  }

  toDomain(dto: OrderDto): Order {
    return Order.create(
      dto.id,
      dto.customerId,
      dto.items.map(itemDto =>
        new OrderItem(
          itemDto.productId,
          itemDto.name,
          itemDto.price,
          itemDto.quantity
        )
      )
    );
  }
  
  toOrderItems(itemDtos: OrderItemDto[]): OrderItem[] {
    return itemDtos.map(itemDto =>
      new OrderItem(
        itemDto.productId,
        itemDto.name,
        itemDto.price,
        itemDto.quantity
      )
    );
  }
}