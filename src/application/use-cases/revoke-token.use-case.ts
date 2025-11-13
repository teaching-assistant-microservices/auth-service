import { Inject, Injectable } from '@nestjs/common';
import { ITokenBlacklistRepository } from '../ports/out/token-blacklist.repository.port';
import { IRefreshTokensRepository } from '../ports/out/refresh-tokens.repository.port';

@Injectable()
export class RevokeTokenUseCase {
  constructor(
    @Inject(ITokenBlacklistRepository)
    private readonly tokenBlacklistRepository: ITokenBlacklistRepository,
    @Inject(IRefreshTokensRepository)
    private readonly refreshTokensRepository: IRefreshTokensRepository,
  ) {}

  async execute(jti: string): Promise<{ message: string }> {
    try {
      // 1. Agregar jti a blacklist (con expiración en 15 min desde ahora)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await this.tokenBlacklistRepository.add(jti, expiresAt);

      // 2. Revocar refresh token asociado
      await this.refreshTokensRepository.revokeByJti(jti);

      return { message: 'Token revoked successfully' };
    } catch (error) {
      throw new Error('Failed to revoke token');
    }
  }
}
