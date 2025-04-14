import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import configuration from './config/configuration';
import { InfrastructureAuthModule } from '@cms-project/infrastructure-auth';
import { CustomerApplicationModule } from '@cms-project/customer-application';
import { OrderApplicationModule } from '@cms-project/order-application';
import { PaymentApplicationModule } from '@cms-project/payment-application';
import { CustomerEntity, OrderEntity, OrderItemEntity } from '@cms-project/infrastructure-db';
import { AuthController } from './controllers/auth.controller';
import { CustomersController } from './controllers/customers.controller';
import { OrdersController } from './controllers/orders.controller';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [CustomerEntity, OrderEntity, OrderItemEntity],
        synchronize: true,
      }),
    }),
    CqrsModule,
    InfrastructureAuthModule,
    CustomerApplicationModule,
    OrderApplicationModule,
    PaymentApplicationModule,
  ],
  controllers: [AuthController, CustomersController, OrdersController, HealthController],
})
export class AppModule {}