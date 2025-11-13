import { RefreshToken } from '../../../domain/model/refresh-token.entity';

export interface IRefreshTokensRepository {
  save(refreshToken: RefreshToken): Promise<RefreshToken>;
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  findByJti(jti: string): Promise<RefreshToken | null>;
  revokeByJti(jti: string): Promise<void>;
  revokeByUserId(userId: string): Promise<void>;
  deleteExpired(): Promise<void>;
}

export const IRefreshTokensRepository = Symbol('IRefreshTokensRepository');
