export interface IAuthService {
  login(email: string, password: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
      id: string;
      email: string;
      name: string;
    };
  }>;

  refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
      id: string;
      email: string;
      name: string;
    };
  }>;

  validateToken(token: string): Promise<{
    valid: boolean;
    payload?: any;
  }>;

  logout(token: string, refreshToken: string): Promise<{ message: string }>;

  revokeToken(jti: string): Promise<{ message: string }>;
}

export const IAuthService = Symbol('IAuthService');
