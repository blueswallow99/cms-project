export interface IPaymentService {
  processPayment(
    orderId: string,
    amount: number,
    paymentData: any
  ): Promise<PaymentResult>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
}
