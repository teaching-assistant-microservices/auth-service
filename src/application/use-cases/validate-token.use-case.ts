import { Inject, Injectable } from '@nestjs/common';
import { ITokenBlacklistRepository } from '../ports/out/token-blacklist.repository.port';
import { IJwtService } from '../ports/out/jwt.service.port';

// src/auth/application/use-cases/validate-token.use-case.ts

@Injectable()
export class ValidateTokenUseCase {
  constructor(
    @Inject(ITokenBlacklistRepository)
    private readonly tokenBlacklistRepository: ITokenBlacklistRepository,
    @Inject(IJwtService)
    private readonly jwtService: IJwtService,
  ) {}

  async execute(token: string): Promise<{
    valid: boolean;
    payload?: any;
  }> {
    try {
      // 1. Verificar firma y expiración del token
      const payload = this.jwtService.verifyToken(token);

      // 2. Verificar que el token no esté en blacklist
      const isBlacklisted = await this.tokenBlacklistRepository.isBlacklisted(
        payload.jti,
      );

      if (isBlacklisted) {
        return {
          valid: false,
        };
      }

      // 3. Token válido
      return {
        valid: true,
        payload: {
          id: payload.sub, // Mapear sub a id para consistencia
          email: payload.email,
          role: payload.role,
          // ... otros campos necesarios
        },
      };
    } catch (error) {
      // Token inválido o expirado
      return {
        valid: false,
      };
    }
  }
}
