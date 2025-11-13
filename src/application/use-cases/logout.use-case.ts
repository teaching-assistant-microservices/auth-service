import { Inject, Injectable } from '@nestjs/common';
import { ITokenBlacklistRepository } from '../ports/out/token-blacklist.repository.port';
import { IRefreshTokensRepository } from '../ports/out/refresh-tokens.repository.port';
import { IJwtService } from '../ports/out/jwt.service.port';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(ITokenBlacklistRepository)
    private readonly tokenBlacklistRepository: ITokenBlacklistRepository,
    @Inject(IRefreshTokensRepository)
    private readonly refreshTokensRepository: IRefreshTokensRepository,
    @Inject(IJwtService)
    private readonly jwtService: IJwtService,
  ) {}

  async execute(
    token: string,
    refreshToken: string,
  ): Promise<{ message: string }> {
    try {
      // 1. Decodificar access token para obtener jti
      const decoded = this.jwtService.decodeToken(token);

      if (decoded && decoded.jti) {
        // 2. Agregar access token jti a blacklist
        const expiresAt = this.jwtService.getTokenExpirationDate(token);
        if (expiresAt) {
          await this.tokenBlacklistRepository.add(decoded.jti, expiresAt);
        }

        // 3. Revocar refresh token asociado
        await this.refreshTokensRepository.revokeByJti(decoded.jti);
      }

      return { message: 'Logout successful' };
    } catch (error) {
      // Incluso si hay error, intentamos invalidar lo que podamos
      return { message: 'Logout successful' };
    }
  }
}
