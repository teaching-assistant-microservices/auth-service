export class TokenResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
  };

  constructor(
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    user: { id: string; email: string; name: string },
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
    this.user = user;
  }
}
