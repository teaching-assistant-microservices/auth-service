import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

@Injectable()
export class JwtService {
  private readonly jwtSecret: string;
  private readonly accessTokenExpiration = '15m'; // 15 minutos
  private readonly refreshTokenExpiration = '7d'; // 7 días

  constructor() {
    // Obtener el secreto JWT desde las variables de entorno
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';

    if (this.jwtSecret === 'default-secret-key-change-in-production') {
      console.warn('WARNING: Using default JWT secret. Please set JWT_SECRET in environment variables.');
    }
  }

  generateAccessToken(
    userId: string,
    email: string,
    role: string = 'user',
  ): {
    token: string;
    jti: string;
    expiresIn: number;
  } {
    const jti = randomUUID();
    const iat = Math.floor(Date.now() / 1000);

    const payload = {
      sub: userId,
      email,
      role,
      iat,
      jti,
    };

    const token = jwt.sign(payload, this.jwtSecret, {
      algorithm: 'HS256',
      expiresIn: this.accessTokenExpiration,
      issuer: 'pedagogico-api',
      audience: 'pedagogico-clients',
    });

    // Calcular segundos de expiración (15 minutos = 900 segundos)
    const expiresIn = 900;

    return { token, jti, expiresIn };
  }

  generateRefreshToken(userId: string): {
    token: string;
    jti: string;
    expiresAt: Date;
  } {
    const jti = randomUUID();
    const iat = Math.floor(Date.now() / 1000);

    const payload = {
      sub: userId,
      type: 'refresh',
      jti,
      iat,
    };

    const token = jwt.sign(payload, this.jwtSecret, {
      algorithm: 'HS256',
      expiresIn: this.refreshTokenExpiration,
      issuer: 'pedagogico-api',
      audience: 'pedagogico-clients',
    });

    // 7 días en milisegundos
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return { token, jti, expiresAt };
  }

  verifyToken(token: string): any {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        algorithms: ['HS256'],
        issuer: 'pedagogico-api',
        audience: 'pedagogico-clients',
      });

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }

  decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }

  getTokenExpirationDate(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return null;
    }

    return new Date(decoded.exp * 1000);
  }
}
