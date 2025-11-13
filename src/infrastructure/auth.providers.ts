import { Provider } from '@nestjs/common';
import { IAuthService } from '../application/ports/in/auth.service.port';
import { IRefreshTokensRepository } from '../application/ports/out/refresh-tokens.repository.port';
import { ITokenBlacklistRepository } from '../application/ports/out/token-blacklist.repository.port';
import { IUsersClient } from '../application/ports/out/users-client.port';
import { IJwtService } from '../application/ports/out/jwt.service.port';
import { IBcryptService } from '../application/ports/out/bcrypt.service.port';
import { AuthService } from '../domain/auth.service';
import { RefreshTokensRepositoryAdapter } from './adapters/out/persistence/postgres/refresh-tokens.repository.adapter';
import { TokenBlacklistRepositoryAdapter } from './adapters/out/persistence/postgres/token-blacklist.repository.adapter';
import { UsersClientAdapter } from './adapters/out/persistence/users-client.adapter';
import { JwtService } from './adapters/out/security/jwt.service';
import { BcryptService } from './adapters/out/security/bcrypt.service';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token.use-case';
import { ValidateTokenUseCase } from '../application/use-cases/validate-token.use-case';
import { LogoutUseCase } from '../application/use-cases/logout.use-case';
import { RevokeTokenUseCase } from '../application/use-cases/revoke-token.use-case';

export const authProviders: Provider[] = [
  // Use Cases
  LoginUseCase,
  RefreshTokenUseCase,
  ValidateTokenUseCase,
  LogoutUseCase,
  RevokeTokenUseCase,

  // Service
  {
    provide: IAuthService,
    useClass: AuthService,
  },

  // Repositories
  {
    provide: IRefreshTokensRepository,
    useClass: RefreshTokensRepositoryAdapter,
  },
  {
    provide: ITokenBlacklistRepository,
    useClass: TokenBlacklistRepositoryAdapter,
  },

  // External Clients
  {
    provide: IUsersClient,
    useClass: UsersClientAdapter,
  },

  // Security Services
  {
    provide: IJwtService,
    useClass: JwtService,
  },
  {
    provide: IBcryptService,
    useClass: BcryptService,
  },
];
