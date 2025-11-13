export interface IJwtService {
  generateAccessToken(
    userId: string,
    email: string,
    role?: string,
  ): { token: string; jti: string; expiresIn: number };

  generateRefreshToken(
    userId: string,
  ): { token: string; expiresAt: Date };

  verifyToken(token: string): any;

  decodeToken(token: string): any;

  getTokenExpirationDate(token: string): Date | null;
}

export const IJwtService = Symbol('IJwtService');
