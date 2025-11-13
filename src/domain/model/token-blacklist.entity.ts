export class TokenBlacklist {
  jti: string; // JWT ID
  revokedAt: Date;
  expiresAt: Date; // Para limpieza automática

  constructor(jti: string, revokedAt: Date, expiresAt: Date) {
    this.jti = jti;
    this.revokedAt = revokedAt;
    this.expiresAt = expiresAt;
  }
}
