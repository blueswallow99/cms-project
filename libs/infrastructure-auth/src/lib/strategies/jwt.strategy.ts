import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ICustomerRepository } from '@cms-project/customer-domain';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private customerRepository: ICustomerRepository,
    configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    const { sub: id } = payload;
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new UnauthorizedException('User not found');
    }

    return { userId: id, email: customer.getEmail() };
  }
}