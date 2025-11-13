import { Module } from '@nestjs/common';
import { AuthModule } from './infrastructure/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
