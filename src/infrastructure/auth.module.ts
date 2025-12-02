import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './adapters/in/web/auth.controller';
import { RefreshTokenSchema } from './adapters/out/persistence/postgres/refresh-token.schema';
import { TokenBlacklistSchema } from './adapters/out/persistence/postgres/token-blacklist.schema';
import { authProviders } from './auth.providers';
import { envs } from '../config/configuration';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.database.host,
      port: envs.database.port,
      username: envs.database.username,
      password: envs.database.password,
      database: envs.database.database,
      entities: [RefreshTokenSchema, TokenBlacklistSchema],
      synchronize: envs.database.synchronize,
    }),
    TypeOrmModule.forFeature([RefreshTokenSchema, TokenBlacklistSchema]),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: envs.usersService.host,
          port: envs.usersService.port,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [...authProviders],
})
export class AuthModule {}
