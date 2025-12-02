import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IAuthService } from '../../../../application/ports/in/auth.service.port';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@Controller()
export class AuthController {
  constructor(
    @Inject(IAuthService)
    private readonly authService: IAuthService,
  ) {}

  @MessagePattern({ cmd: 'auth_login' })
  async login(@Payload() loginDto: LoginDto): Promise<TokenResponseDto> {
    console.log('🔵 AUTH-SERVICE: Received login request for email:', loginDto.email);

    try {
      const result = await this.authService.login(
        loginDto.email,
        loginDto.password,
      );

      console.log('✅ AUTH-SERVICE: Login successful for user:', result.user.email);

      return new TokenResponseDto(
        result.accessToken,
        result.refreshToken,
        result.expiresIn,
        result.user,
      );
    } catch (error) {
      console.error('❌ AUTH-SERVICE: Login failed:', error.message);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'auth_refresh_token' })
  async refreshToken(
    @Payload() refreshTokenDto: RefreshTokenDto,
  ): Promise<TokenResponseDto> {
    const result = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );

    return new TokenResponseDto(
      result.accessToken,
      result.refreshToken,
      result.expiresIn,
      result.user,
    );
  }

  @MessagePattern({ cmd: 'auth_validate_token' })
  async validateToken(
    @Payload() validateTokenDto: ValidateTokenDto,
  ): Promise<{ valid: boolean; payload?: any }> {
    return await this.authService.validateToken(validateTokenDto.token);
  }

  @MessagePattern({ cmd: 'auth_logout' })
  async logout(@Payload() logoutDto: LogoutDto): Promise<{ message: string }> {
    return await this.authService.logout(
      logoutDto.token,
      logoutDto.refreshToken,
    );
  }

  @MessagePattern({ cmd: 'auth_revoke_token' })
  async revokeToken(
    @Payload() payload: { jti: string },
  ): Promise<{ message: string }> {
    return await this.authService.revokeToken(payload.jti);
  }
}