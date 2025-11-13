import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { IRefreshTokensRepository } from '../../../../../application/ports/out/refresh-tokens.repository.port';
import { RefreshToken } from '../../../../../domain/model/refresh-token.entity';
import { RefreshTokenSchema } from './refresh-token.schema';

@Injectable()
export class RefreshTokensRepositoryAdapter implements IRefreshTokensRepository {
  constructor(
    @InjectRepository(RefreshTokenSchema)
    private readonly repository: Repository<RefreshTokenSchema>,
  ) {}

  async save(refreshToken: RefreshToken): Promise<RefreshToken> {
    const schema = this.toSchema(refreshToken);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const found = await this.repository.findOne({ where: { tokenHash } });
    return found ? this.toDomain(found) : null;
  }

  async findByJti(jti: string): Promise<RefreshToken | null> {
    const found = await this.repository.findOne({ where: { jti } });
    return found ? this.toDomain(found) : null;
  }

  async revokeByJti(jti: string): Promise<void> {
    await this.repository.update(
      { jti },
      { revoked: true, revokedAt: new Date() },
    );
  }

  async revokeByUserId(userId: string): Promise<void> {
    await this.repository.update(
      { userId },
      { revoked: true, revokedAt: new Date() },
    );
  }

  async deleteExpired(): Promise<void> {
    await this.repository.delete({
      expiresAt: LessThan(new Date()),
    });
  }

  private toSchema(domain: RefreshToken): RefreshTokenSchema {
    const schema = new RefreshTokenSchema();
    schema.id = domain.id;
    schema.userId = domain.userId;
    schema.tokenHash = domain.tokenHash;
    schema.jti = domain.jti;
    schema.expiresAt = domain.expiresAt;
    schema.createdAt = domain.createdAt;
    schema.revoked = domain.revoked;
    schema.revokedAt = domain.revokedAt;
    return schema;
  }

  private toDomain(schema: RefreshTokenSchema): RefreshToken {
    return new RefreshToken(
      schema.id,
      schema.userId,
      schema.tokenHash,
      schema.jti,
      schema.expiresAt,
      schema.createdAt,
      schema.revoked,
      schema.revokedAt,
    );
  }
}
