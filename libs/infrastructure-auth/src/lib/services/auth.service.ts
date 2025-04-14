// libs/infrastructure-auth/src/lib/services/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ICustomerRepository } from '@cms-project/customer-domain';

@Injectable()
export class AuthService {
  constructor(
    private customerRepository: ICustomerRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // This would need modification based on how you store passwords
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