export class GetCustomerOrdersQuery {
  constructor(
    public readonly customerId: string,
    public readonly page = 1,
    public readonly pageSize = 10
  ) {}
}
