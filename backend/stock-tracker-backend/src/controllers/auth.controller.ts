import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
  ): Promise<{ token: string }> {
    const { username, password } = body;

    // In a real implementation, this would validate against a user database
    // For now, we'll use the same credentials as the frontend simulation
    if (username === 'admin' && password === 'password') {
      // In a real implementation, this would generate a real JWT token
      // For now, we'll return a dummy token
      return { token: 'dummy-jwt-token' };
    } else {
      throw new UnauthorizedException('Invalid username or password.');
    }
  }
}