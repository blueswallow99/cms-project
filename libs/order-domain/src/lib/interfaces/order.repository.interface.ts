import { Order } from '../entities/order.entity';

export const ORDER_REPOSITORY = Symbol('IOrderRepository');

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByCustomerId(customerId: string): Promise<Order[]>;
  save(order: Order): Promise<void>;
  update(order: Order): Promise<void>;
  delete(id: string): Promise<void>;
}