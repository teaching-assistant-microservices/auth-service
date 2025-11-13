export class RefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  jti: string; // JWT ID del access token asociado
  expiresAt: Date;
  createdAt: Date;
  revoked: boolean;
  revokedAt: Date | null;

  constructor(
    id: string,
    userId: string,
    tokenHash: string,
    jti: string,
    expiresAt: Date,
    createdAt: Date,
    revoked: boolean,
    revokedAt: Date | null,
  ) {
    this.id = id;
    this.userId = userId;
    this.tokenHash = tokenHash;
    this.jti = jti;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
    this.revoked = revoked;
    this.revokedAt = revokedAt;
  }
}
