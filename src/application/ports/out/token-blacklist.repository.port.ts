import { TokenBlacklist } from '../../../domain/model/token-blacklist.entity';

export interface ITokenBlacklistRepository {
  add(jti: string, expiresAt: Date): Promise<void>;
  isBlacklisted(jti: string): Promise<boolean>;
  deleteExpired(): Promise<void>;
}

export const ITokenBlacklistRepository = Symbol('ITokenBlacklistRepository');
