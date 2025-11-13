import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IUsersClient } from '../ports/out/users-client.port';
import { IRefreshTokensRepository } from '../ports/out/refresh-tokens.repository.port';
import { IJwtService } from '../ports/out/jwt.service.port';
import { IBcryptService } from '../ports/out/bcrypt.service.port';
import { RefreshToken } from '../../domain/model/refresh-token.entity';
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';

@Injectable()
export class LoginUseCase {
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

  async execute(email: string, password: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
      id: string;
      email: string;
      name: string;
    };
  }> {
    // 1. Buscar usuario por email (llamada TCP a users-service)
    const user = await this.usersClient.getUserByEmail(email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    // 2. Comparar contraseña con bcrypt
    const isPasswordValid = await this.bcryptService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // 3. Generar access token (RS256, 15 min)
    const { token: accessToken, jti, expiresIn } = this.jwtService.generateAccessToken(
      user.id,
      user.email,
      'user',
    );

    // 4. Generar refresh token (RS256, 7 días)
    const { token: refreshTokenStr, expiresAt } =
      this.jwtService.generateRefreshToken(user.id);

    // 5. Hashear refresh token para almacenarlo
    const refreshTokenHash = await this.bcryptService.hash(refreshTokenStr);

    // 6. Guardar refresh token en base de datos
    const refreshToken = new RefreshToken(
      randomUUID(),
      user.id,
      refreshTokenHash,
      jti,
      expiresAt,
      new Date(),
      false,
      null,
    );

    await this.refreshTokensRepository.save(refreshToken);

    // 7. Retornar tokens y datos de usuario (sin password)
    return {
      accessToken,
      refreshToken: refreshTokenStr,
      expiresIn,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
