import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { IUsersClient } from '../../../../application/ports/out/users-client.port';

@Injectable()
export class UsersClientAdapter implements IUsersClient {
  constructor(@Inject('USERS_SERVICE') private client: ClientProxy) {}

  async getUserByEmail(email: string): Promise<{
    id: string;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  } | null> {
    try {
      const user = await lastValueFrom(
        this.client.send({ cmd: 'get_user_by_email' }, { email }),
      );

      return user || null;
    } catch (error) {
      return null;
    }
  }

  async getUserById(id: string): Promise<{
    id: string;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  } | null> {
    try {
      const user = await lastValueFrom(
        this.client.send({ cmd: 'get_user_by_id' }, { id }),
      );

      return user || null;
    } catch (error) {
      return null;
    }
  }
}
