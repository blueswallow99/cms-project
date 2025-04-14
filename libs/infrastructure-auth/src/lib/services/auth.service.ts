import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CUSTOMER_REPOSITORY } from '@cms-project/customer-domain';
import { CustomerRepository } from '@cms-project/infrastructure-db';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private customerRepository: CustomerRepository,
    private jwtService: JwtService,
  ) {  console.log(this.customerRepository, "-----------------------------------");}

  async validateUser(email: string, password: string): Promise<any> {
    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, customer.getPasswordHash());
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return customer;
  }

  async login(user: any) {
    const payload = { email: user.getEmail(), sub: user.getId() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}