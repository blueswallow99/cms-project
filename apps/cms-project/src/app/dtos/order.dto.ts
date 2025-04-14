import { IsArray, IsEnum, IsString, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@cms-project/order-domain';

export class OrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsUUID()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class ProcessPaymentDto {
  @IsString()
  paymentMethod: string;

  @IsString()
  cardNumber: string;

  @IsNumber()
  expiryMonth: number;

  @IsNumber()
  expiryYear: number;

  @IsString()
  cvv: string;
}