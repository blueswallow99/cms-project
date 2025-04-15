import { Module } from '@nestjs/common';
import { MockPaymentService } from './services/mock-payment.service';

@Module({
  controllers: [],
  providers: [MockPaymentService],
  exports: [MockPaymentService],
})
export class PaymentApplicationModule {}
