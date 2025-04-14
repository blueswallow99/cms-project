export class ProcessPaymentCommand {
  constructor(
    public readonly orderId: string,
    public readonly paymentData: any,
  ) {}
}
