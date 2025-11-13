export interface IUsersClient {
  getUserByEmail(email: string): Promise<{
    id: string;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  } | null>;
}

export const IUsersClient = Symbol('IUsersClient');
