import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('token_blacklist')
export class TokenBlacklistSchema {
  @PrimaryColumn('uuid')
  jti: string;

  @CreateDateColumn()
  revokedAt: Date;

  @Column({ type: 'timestamp' })
  @Index()
  expiresAt: Date;
}
