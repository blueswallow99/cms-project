import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@cms-project/infrastructure-auth';
import { SignInDto } from '../dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.authService.validateUser(email, password);
    return this.authService.login(user);
  }
}