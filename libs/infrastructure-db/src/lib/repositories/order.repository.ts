import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IOrderRepository } from '@cms-project/order-domain';
import {
  Order as DomainOrder,
  OrderItem as DomainOrderItem,
  OrderStatus
} from '@cms-project/order-domain';
import { OrderEntity } from '../entities/order.entity';
import { OrderItemEntity } from '../entities/order-item.entity';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  async findById(id: string): Promise<DomainOrder | null> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!orderEntity) {
      return null;
    }

    return this.toDomainEntity(orderEntity);
  }

  async findByCustomerId(customerId: string): Promise<DomainOrder[]> {
    const orderEntities = await this.orderRepository.find({
      where: { customerId },
      relations: ['items'],
    });

    return orderEntities.map(entity => this.toDomainEntity(entity));
  }

  async save(order: DomainOrder): Promise<void> {
    const orderEntity = this.toInfrastructureEntity(order);
    await this.orderRepository.save(orderEntity);
  }

  async update(order: DomainOrder): Promise<void> {
    const orderEntity = this.toInfrastructureEntity(order);
    await this.orderRepository.save(orderEntity);
  }

  async delete(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }

  private toDomainEntity(orderEntity: OrderEntity): DomainOrder {
    const orderItems = orderEntity.items.map(item => 
      new DomainOrderItem(
        item.productId,
        item.name,
        item.price,
        item.quantity
      )
    );

    const order = DomainOrder.reconstitute(
      orderEntity.id,
      orderEntity.customerId,
      orderItems,
      orderEntity.status as OrderStatus,
      orderEntity.paymentId,
      orderEntity.createdAt,
      orderEntity.updatedAt
    );

    return order;
  }

  private toInfrastructureEntity(order: DomainOrder): OrderEntity {
    const orderEntity = new OrderEntity();
    orderEntity.id = order.getId();
    orderEntity.customerId = order.getCustomerId();
    orderEntity.status = order.getStatus();
    orderEntity.paymentId = order.getPaymentId();
    orderEntity.createdAt = order.getCreatedAt();
    orderEntity.updatedAt = order.getUpdatedAt();

    orderEntity.items = order.getItems().map(item => {
      const itemEntity = new OrderItemEntity();
      itemEntity.orderId = order.getId();
      itemEntity.productId = item.getProductId();
      itemEntity.name = item.getName();
      itemEntity.price = item.getPrice();
      itemEntity.quantity = item.getQuantity();
      return itemEntity;
    });

    return orderEntity;
  }
}