import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ITokenBlacklistRepository } from '../../../../../application/ports/out/token-blacklist.repository.port';
import { TokenBlacklistSchema } from './token-blacklist.schema';

@Injectable()
export class TokenBlacklistRepositoryAdapter
  implements ITokenBlacklistRepository
{
  constructor(
    @InjectRepository(TokenBlacklistSchema)
    private readonly repository: Repository<TokenBlacklistSchema>,
  ) {}

  async add(jti: string, expiresAt: Date): Promise<void> {
    const schema = new TokenBlacklistSchema();
    schema.jti = jti;
    schema.expiresAt = expiresAt;
    schema.revokedAt = new Date();

    await this.repository.save(schema);
  }

  async isBlacklisted(jti: string): Promise<boolean> {
    const found = await this.repository.findOne({ where: { jti } });
    return !!found;
  }

  async deleteExpired(): Promise<void> {
    await this.repository.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}
