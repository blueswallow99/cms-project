import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './services/auth.service';
import { CUSTOMER_REPOSITORY, CustomerDomainModule } from '@cms-project/customer-domain';
import { CustomerEntity, CustomerRepository } from '@cms-project/infrastructure-db';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    CustomerDomainModule,
    TypeOrmModule.forFeature([CustomerEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerRepository,
    },
  ],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class InfrastructureAuthModule {}
