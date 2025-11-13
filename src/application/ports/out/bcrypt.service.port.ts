export interface IBcryptService {
  hash(plainText: string): Promise<string>;
  compare(plainText: string, hash: string): Promise<boolean>;
}

export const IBcryptService = Symbol('IBcryptService');
