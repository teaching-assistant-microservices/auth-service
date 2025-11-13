import { Injectable } from '@nestjs/common';
import { IAuthService } from '../application/ports/in/auth.service.port';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token.use-case';
import { ValidateTokenUseCase } from '../application/use-cases/validate-token.use-case';
import { LogoutUseCase } from '../application/use-cases/logout.use-case';
import { RevokeTokenUseCase } from '../application/use-cases/revoke-token.use-case';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly revokeTokenUseCase: RevokeTokenUseCase,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: { id: string; email: string; name: string };
  }> {
    return await this.loginUseCase.execute(email, password);
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: { id: string; email: string; name: string };
  }> {
    return await this.refreshTokenUseCase.execute(refreshToken);
  }

  async validateToken(token: string): Promise<{ valid: boolean; payload?: any }> {
    return await this.validateTokenUseCase.execute(token);
  }

  async logout(
    token: string,
    refreshToken: string,
  ): Promise<{ message: string }> {
    return await this.logoutUseCase.execute(token, refreshToken);
  }

  async revokeToken(jti: string): Promise<{ message: string }> {
    return await this.revokeTokenUseCase.execute(jti);
  }
}
