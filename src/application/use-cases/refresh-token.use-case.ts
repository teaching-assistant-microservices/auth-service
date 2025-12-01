import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IUsersClient } from '../ports/out/users-client.port';
import { IRefreshTokensRepository } from '../ports/out/refresh-tokens.repository.port';
import { IJwtService } from '../ports/out/jwt.service.port';
import { IBcryptService } from '../ports/out/bcrypt.service.port';
import { RefreshToken } from '../../domain/model/refresh-token.entity';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(IUsersClient)
    private readonly usersClient: IUsersClient,
    @Inject(IRefreshTokensRepository)
    private readonly refreshTokensRepository: IRefreshTokensRepository,
    @Inject(IJwtService)
    private readonly jwtService: IJwtService,
    @Inject(IBcryptService)
    private readonly bcryptService: IBcryptService,
  ) {}

  async execute(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: { id: string; email: string; name: string };
  }> {
    // 1. Verificar el refresh token
    let decoded: any;
    try {
      decoded = this.jwtService.verifyToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 2. Verificar que sea un refresh token
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const userId = decoded.sub;
    const jti = decoded.jti;

    if (!jti) {
      throw new UnauthorizedException('Invalid refresh token - missing jti');
    }

    // 3. Buscar refresh token en base de datos por jti
    const storedToken = await this.refreshTokensRepository.findByJti(jti);

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    // 4. Verificar que no esté revocado
    if (storedToken.revoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    // 5. Verificar que no esté expirado
    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    // 6. Verificar que el userId coincida
    if (storedToken.userId !== userId) {
      throw new UnauthorizedException('Invalid refresh token - user mismatch');
    }

    // 7. Obtener información del usuario
    const user = await this.usersClient.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 8. Generar nuevo access token
    const { token: newAccessToken, jti: accessJti, expiresIn } =
      this.jwtService.generateAccessToken(user.id, user.email, 'user');

    // 9. Generar nuevo refresh token (rotación de refresh tokens)
    const { token: newRefreshToken, jti: newRefreshJti, expiresAt } =
      this.jwtService.generateRefreshToken(user.id);

    // 10. Hashear y guardar nuevo refresh token
    const newRefreshTokenHash = await this.bcryptService.hash(newRefreshToken);

    const refreshTokenEntity = new RefreshToken(
      randomUUID(),
      user.id,
      newRefreshTokenHash,
      newRefreshJti,
      expiresAt,
      new Date(),
      false,
      null,
    );

    await this.refreshTokensRepository.save(refreshTokenEntity);

    // 11. Revocar el refresh token anterior (rotación)
    await this.refreshTokensRepository.revokeByJti(jti);

    // 12. Retornar nuevos tokens
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
