import { Injectable } from '@nestjs/common';
import { IPaymentService, PaymentResult } from '@cms-project/payment-domain';

@Injectable()
export class MockPaymentService implements IPaymentService {
  async processPayment(orderId: string, amount: number, paymentData: any): Promise<PaymentResult> {
    //NOTE: I used AI for this MockPaymentService
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, let's say payments over $1000 fail
    if (amount > 1000) {
      return {
        success: false,
        errorMessage: 'Payment amount exceeds limit',
      };
    }
    
    // Successful payment
    return {
      success: true,
      transactionId: `mock-trans-${Date.now()}`,
    };
  }
}